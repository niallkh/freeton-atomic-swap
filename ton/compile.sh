solc contracts/$1.sol -o contracts &&
tvm_linker compile contracts/$1.code &&
mv *.tvc contracts/$1.tvc &&
tondev gen contracts/$1.sol
