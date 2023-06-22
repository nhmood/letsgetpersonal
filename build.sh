#!/bin/bash
# chrome/firefox extension package builder for letsgetpersonal
#
# nhmood @ goosecode
# june 21st, 2023


extensions=("chrome" "firefox")
version=$1

if [[ -z "$version" ]]; then
  echo "version needs to be passed"
  exit 1
fi

mkdir -p release

# for each extension type, copy the corresponding manifest
# and create a zip file
for extension in ${extensions[@]}; do
  echo "building $extension"
  cp "manifest.$extension.json" extension/manifest.json
  zip -r "release/LGP$version-$extension.zip" extension/*
done

# clean up the included manifest
rm extension/manifest.json
