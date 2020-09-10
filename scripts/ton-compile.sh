solc conracts/ton/$1.sol -o conracts/ton &&
tvm_linker compile conracts/ton/$1.code &&
mv *.tvc conracts/ton/$1.tvc &&
npx tondev gen conracts/ton/$1.sol
