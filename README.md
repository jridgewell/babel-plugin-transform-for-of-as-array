# babel-plugin-transform-for-of-as-array

Transform all for-of loops into the equivalent array for loop

## Example

**In**

```js
for (const elm of array) {
  console.log(elm);
}

let item;
for ({ item } of array) {
  console.log(item);
}
```

**Out**

```js
for (let _i = 0, _array = array; _i < _array.length; _i++) {
  const elm = _array[_i];
  console.log(elm);
}

let item;
for (let _i2 = 0, _array = array; _i2 < _array.length; _i2++) {
  const { item } = _array[_i2];
  console.log(item);
}
```

## Installation

```sh
$ npm install babel-plugin-transform-for-of-as-array
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-for-of-as-array"]
}
```

### Via CLI

```sh
$ babel --plugins transform-for-of-as-array script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-for-of-as-array"]
});
```
