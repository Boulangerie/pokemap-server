#!/bin/bash
if [ -d "./pgoapi" ]; then
  rm -rf ./pgoapi
fi
git clone git@github.com:tejado/pgoapi.git
cd pgoapi && python setup.py install && cd -
mkdir -p ./python_vendors
if [ -d "./pgoapi" ]; then
  rm -rf ./python_vendors/pgoapi
  rm -f ./python_vendors/pokecli.py
  mv ./pgoapi/pgoapi ./python_vendors/pgoapi
  cp ./pokecli.py ./python_vendors/
  rm -rf ./pgoapi
fi
