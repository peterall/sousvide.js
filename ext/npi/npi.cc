/* This code is PUBLIC DOMAIN, and is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND. See the accompanying 
 * LICENSE file.
 */

#include <v8.h>
#include <node.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <stdint.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/spi/spidev.h>

using namespace node;
using namespace v8;

#define REQ_FUN_ARG(I, VAR)                                             \
  if (args.Length() <= (I) || !args[I]->IsFunction())                   \
    return ThrowException(Exception::TypeError(                         \
                  String::New("Argument " #I " must be a function")));  \
  Local<Function> VAR = Local<Function>::Cast(args[I]);

#define REQ_INT_ARG(I, VAR)																							\
	if(args.Length() <= (I) || !args[I]->IsInt32())												\
    return ThrowException(Exception::TypeError(													\
									String::New("Argument " #I " must be an integer")));  \
  int VAR = args[I]->Int32Value();

class ADC: ObjectWrap
{
private:
  int fd;
  uint8_t mode;
  uint8_t bits;
  uint32_t speed;
  const char* device;
public:

  static Persistent<FunctionTemplate> s_ct;
  static void Init(Handle<Object> target)
  {
    HandleScope scope;

    Local<FunctionTemplate> t = FunctionTemplate::New(New);

    s_ct = Persistent<FunctionTemplate>::New(t);
    s_ct->InstanceTemplate()->SetInternalFieldCount(1);
    s_ct->SetClassName(String::NewSymbol("ADC"));

    NODE_SET_PROTOTYPE_METHOD(s_ct, "read", read);

    target->Set(String::NewSymbol("ADC"),
                s_ct->GetFunction());
  }

  ADC() :
    fd(0), mode(SPI_MODE_0), bits(8), speed(500000), device("/dev/spidev0.0")
  {
    int ret;

    fd = open(device, O_RDWR);
    if (fd < 0)
      goto error;
    
    ret = ioctl(fd, SPI_IOC_WR_MODE, &mode);
    if (ret == -1)
      goto error;

    ret = ioctl(fd, SPI_IOC_WR_BITS_PER_WORD, &bits);
    if (ret == -1)
      goto error;

    ret = ioctl(fd, SPI_IOC_WR_MAX_SPEED_HZ, &speed);
    if (ret == -1)
      goto error;

    return;
error:
    if(fd) {
      close(fd);
      fd = 0;
    }
  }

  ~ADC()
  {
  }

  bool read(int input, int oversample, int *value)
  {
    uint8_t tx[4] = {0x87 | (input << 4),0,0,0};
    uint8_t rx[4];
    int ret, i;
    struct spi_ioc_transfer tr;
    int acc = 0;

    tr.tx_buf = (unsigned long)tx;
    tr.rx_buf = (unsigned long)rx;
    tr.len = 4;
    tr.delay_usecs = 100;
    tr.speed_hz = speed;
    tr.bits_per_word = bits;

    for(i=0;i<oversample;i++) {
      ret = ioctl(fd, SPI_IOC_MESSAGE(1), &tr);
      if (ret < 1)
        return false;

      acc += (rx[1] << 9 | rx[2] << 1 | (rx[3] >> 7));
    }
    acc /= oversample;
    *value = acc;
    return true;	
  }
  static Handle<Value> New(const Arguments& args)
  {
    HandleScope scope;
    ADC* adc = new ADC();
    
    if(adc->fd == 0)
      return ThrowException(Exception::TypeError(String::New("Failed to open /dev/spidev0.0. Are you root?")));

    adc->Wrap(args.This());
    return args.This();
  }

  struct analogRead_baton_t {
    ADC *adc;
    int input;
    int oversample;
		double sampled;
    Persistent<Function> cb;
  };

  static Handle<Value> read(const Arguments& args)
  {
    HandleScope scope;

		REQ_INT_ARG(0, input);
		REQ_INT_ARG(1, oversample);
    REQ_FUN_ARG(2, cb);

    ADC* adc = ObjectWrap::Unwrap<ADC>(args.This());

    analogRead_baton_t *baton = new analogRead_baton_t();
		baton->adc = adc;
    baton->input = input;
    baton->oversample = oversample;
    baton->cb = Persistent<Function>::New(cb);

    adc->Ref();

    eio_custom(EIO_analogRead, EIO_PRI_DEFAULT, EIO_afterAnalogRead, baton);
    ev_ref(EV_DEFAULT_UC);

    return Undefined();
  }


  static void EIO_analogRead(eio_req *req)
  {
    analogRead_baton_t *baton = static_cast<analogRead_baton_t *>(req->data);
    bool res;
    int value;

    res = baton->adc->read(baton->input, baton->oversample, &value);
     
    baton->sampled = res ? ((double)value / 65536.0) : 0.0;
  }

  static int EIO_afterAnalogRead(eio_req *req)
  {
    HandleScope scope;
    analogRead_baton_t *baton = static_cast<analogRead_baton_t *>(req->data);
    ev_unref(EV_DEFAULT_UC);
    baton->adc->Unref();

    Local<Value> argv[1];

    argv[0] = Number::New(baton->sampled);

    TryCatch try_catch;

    baton->cb->Call(Context::GetCurrent()->Global(), 1, argv);

    if (try_catch.HasCaught()) {
      FatalException(try_catch);
    }

    baton->cb.Dispose();

    delete baton;
    return 0;
  }

};

Persistent<FunctionTemplate> ADC::s_ct;

extern "C" {
  static void init (Handle<Object> target)
  {
    ADC::Init(target);
  }

  NODE_MODULE(npi, init);
}
