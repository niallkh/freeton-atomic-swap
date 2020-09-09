solc ton/$1.sol -o ton &&
tvm_linker compile ton/$1.code &&
mv *.tvc ton/$1.tvc &&
tondev gen ton/$1.sol
