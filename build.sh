#!/bin/sh
set -e


npm run lint

echo '\ntranspiling...'
rm -rf lib
./node_modules/.bin/tsc -p tsconfig.notests.json

echo '\nconverting .js to .mjs...'
for f in `find lib -name '*.js'`; do
  target=`echo $f | sed -e 's/\\.js/\\.mjs/'`
  cp $f $target
  sed -i '' -e "s/from ['\"]\\.\\(.*\\)['\"]/from '\\.\\1.js'/g" $f
  sed -i '' -e "s/from ['\"]\\.\\(.*\\)['\"]/from '\\.\\1.mjs'/g" $target

  cp "$f.map" "$target.map"
  sed -i '' "s/\\.js\\.map/\\.mjs\\.map/g" $target
  sed -i '' "s/\\.js/\\.mjs/g" "$target.map"
done
