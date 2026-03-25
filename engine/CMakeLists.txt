cmake_minimum_required(VERSION 3.10)
project(epidemic_simulator)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find pthreads
find_package(Threads REQUIRED)

# Add executable
add_executable(simulator 
    main.cpp 
    sir.cpp 
    agent.cpp 
    network.cpp
)

# Link pthreads
target_link_libraries(simulator Threads::Threads)
