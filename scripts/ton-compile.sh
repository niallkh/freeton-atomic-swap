rm -rf ton/build
solc ton/$1.sol -o ton/build
tvm_linker compile ton/build/$1.code
mv *.tvc ton/build

