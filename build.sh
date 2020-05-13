#!/bin/sh
set -e


npm run lint

echo '\ntranspiling...'
rm -rf lib
./node_modules/.bin/tsc

echo '\nconverting .js to .mjs...'
for f in `find lib -name '*.js'`; do
  target=`echo $f | sed -e 's/\\.js/\\.mjs/'`
  mv $f $target
  sed -i '' -e "s/from ['\"]\\.\\(.*\\)['\"]/from '\\.\\1.mjs'/g" $target

  mv "$f.map" "$target.map"
  sed -i '' "s/\\.js\\.map/\\.mjs\\.map/g" $target
  sed -i '' "s/\\.js/\\.mjs/g" "$target.map"
done
