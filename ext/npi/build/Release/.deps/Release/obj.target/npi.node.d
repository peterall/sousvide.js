cmd_Release/obj.target/npi.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic  -Wl,-soname=npi.node -o Release/obj.target/npi.node -Wl,--start-group Release/obj.target/npi/npi.o -Wl,--end-group 
