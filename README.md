# node-whisper

![NPM](https://img.shields.io/npm/v/node-whisper.svg)

node-whisper is a powerful and straightforward TypeScript package that provides seamless integration with OpenAI's Whisper Speech-to-Text system. If you're looking to harness the incredible capabilities of Whisper for your projects, you're in the right place.

## Before You Begin:

Make sure you've got your foundation set by following the instructions laid out in the [OpenAI Whisper repository](https://github.com/openai/whisper). Once you've completed those steps, you're ready to dive in.

## Features

    Async Support: Embrace the asynchronous nature of modern JavaScript and take full advantage of async/await when interacting with Whisper.

    Comprehensive Options: All of Whisper's configuration options are supported, giving you fine-grained control over your Speech-to-Text tasks.

    Typescript Support: Enjoy the benefits of static typing and enhanced code readability when working with node-whisper in TypeScript with both esm and cjs modules.

    No dependencies.

## Installation

To add node-whisper to your project, simply run:

```bash
npm install node-whisper

#or with yarn
yarn add node-whisper
```

## Getting Started

```js
import whisper from "node-whisper";

async function transcribeAudio() {
  try {
    const audioFilePath = "path_to_your_audio_file.wav";
    const data = await whisper(audioFilePath);
    console.log("Transcriptions:", data); // all the files paths
    const content = await data.json.getContent();
    console.log(content); // the content
  } catch (error) {
    console.error("Error:", error.message);
  }
}

transcribeAudio();
```

Happy coding!
