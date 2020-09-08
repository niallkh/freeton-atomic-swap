solc ton/$1/$1.sol -o ton/$1 &&
tvm_linker compile ton/$1/$1.code &&
mv *.tvc ton/$1/$1.tvc 
