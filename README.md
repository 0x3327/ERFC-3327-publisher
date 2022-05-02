# ERFC 3327 publisher

This is tool for publishing research to a 3327 repository. 

## Requirements

* [Node.js](http://nodejs.org/)
* [Git](https://git-scm.com/)
* Git should be set to use [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) with empty password.
* [GitHub account](https://github.com/)
* [Quarto](https://quarto.org/docs/get-started/)
* [Hub](https://hub.github.com/)
* Make sure to set [personal access token](https://github.com/settings/tokens) `export GITHUB_TOKEN=<your_token>` on the first Hub run

## Installation Steps

1. Install the module globally with `npm install -g erfc` 
2. Run `erfc` from any folder
3. Alternatively, you can execute it without installation with `npx erfc`

## License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
