#Python 3

# Import socket module
import socket
import re
import datetime
# Create a TCP server socket
#(AF_INET is used for IPv4 protocols)
#(SOCK_STREAM is used for TCP)
serverSocket = socket.socket();

# Prepare a server socket
# FILL IN START
# Assign a port number
serverPort = 80;
# Bind the socket to server address and server port
serverSocket.bind(("localhost",serverPort));

# Listen to at most 1 connection at a time
serverSocket.listen(1);


# FILL IN END

# Server should be up and running and listening to the incoming connections
while True:
    print("Ready to serve...");
    
    # Set up a new connection from the client
    connectionSocket, addr = serverSocket.accept();
    
    # If an exception occurs during the execution of try clause
    # the rest of the clause is skipped
    # If the exception type matches the word after except
    # the except clause is executed
    try:
        # Receives the request message from the client
        message = connectionSocket.recv(4096);
        print("Got message from: {}\n{}".format(addr,message));
        
        # Extract the path of the requested object from the message
        # The path is the second part of HTTP header, identified by [1]
        matches = re.findall("GET\\s([^\\s]+)\\s",message.decode("UTF-8"));
        if(len(matches) > 0):
            filepath = matches[0];
            print(matches);
        # Because the extracted path of the HTTP request includes 
        # a character '\', we read the path from the second character 
            outputdata = "";
            if(filepath == "/"):
                filepath = "index.html";
            else:
                filepath = "." + filepath;
            with(open(filepath,"rb")) as f:
                outputdata = f.read();
        # Read the file "f" and store the entire content of the requested file in a temporary buffer
            
        # Send the HTTP response header line to the connection socket
        # Format: "HTTP/1.1 *code-for-successful-request*\r\n\r\n"
            connectionSocket.send("HTTP/1.1 200 OK\r\n\r\n".encode("ASCII"));
         
        # Send the content of the requested file to the connection socket
        #for i in range(0, len(outputdata)):  
        #    connectionSocket.send(outputdata[i])
            connectionSocket.send(outputdata);
            connectionSocket.send("\r\n".encode("ASCII"));
        
        # Close the client connection socket
        connectionSocket.close()

    except IOError:
        # Send HTTP response message for file not found
        # Same format as above, but with code for "Not Found"
        # FILL IN START        

         # FILL IN END
        connectionSocket.send("<html><head></head><body><h1>404 Not Found</h1></body></html>\r\n".encode("ASCII"));
        
        # Close the client connection socket
        # FILL IN START        
        
         # FILL IN END

serverSocket.close()  

