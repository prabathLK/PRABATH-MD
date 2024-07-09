# Imagine SDK

Imagine SDK is a Node.js library that provides a convenient interface to interact with the Imagine API for image generation and manipulation. This README provides an overview of the library's features, installation instructions, and usage examples.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Imagine Client](#imagine-client)
  - [Response](#response)
  - [Image](#image)
  - [Some More Usage Examples](#some-more-usage-examples)
- [Support](#support)
- [License](#license)

## Installation

To install the package, execute the following command:

```bash
npm install imaginesdk
```

## Usage

The SDK needs to be configured with an API key which is available [here](https://platform.imagine.art/). It will be passed to the Imagine client as an argument while instantiating it.

```typescript
import { client, GenerationStyle, Status } from "imaginesdk";

// Initialize the client with your API key
const imagine = client("<YOUR_API_KEY>");

const main = async () => {
  // Generate an image with the Imagine API
  const response = await imagine.generations(
    `A vibrant and whimsical fantasy forest with magical creatures, glowing plants, and a flowing river, in a digital painting style inspired by video games like Ori and the Blind Forest.`,
    {
      style: GenerationStyle.IMAGINE_V5,
    }
  );

  // Check if the request was successful
  if (response.status() === Status.OK) {
    const image = response.getOrThrow();
    image.asFile("output.png");
  } else {
    console.log(response.errorOrThrow());
  }
};

//  Run the main function
main();
```

**Result**:

![Generations](https://user-images.githubusercontent.com/56919667/261864112-0e419627-cbbe-4fb1-82e2-2637ee6392fb.png)

### Imagine Client

The Imagine class acts as a facade, providing an interface to interact with all of our endpoints. It currently provides the following features:

- **Text-To-Image**: `generations() -> Response[Image]`
- **Image-Remix**: `remix() -> Response[Image]`
- **Upscale**: `upscale() -> Response[Image]`
- **Variations**: `variations() -> Response[Image]`
- **In-Painting**: `inpaint() -> Response[Image]`

For the full list of parameters and other details, check out the [documentation](https://vyroai.notion.site/API-Documentation-e643af82991f4265841cff2951eac803).

### Response

Response is the return type for each of our functions. It contains the following:

- `status()`: Status property which returns an enum containing the status code of the response.
- `data()`: Either returns the response content or null in case of error.
- `getOrThrow()`: Either returns the response content or raises an Error if the response content is empty.
- `getOrElse()`: Either returns the response content or returns the default value if it's empty.
- `errorOrThrow()`: Either returns the error details or raises an Error if the response status is successful.

For the full list of arguments and other details, check out the [documentation](https://vyroai.notion.site/API-Documentation-e643af82991f4265841cff2951eac803).

### Image

All the functions related to Images contain an Image data type as the data in their Response. It currently provides the following:

#### ArrayBuffer

Returns the ArrayBuffer received after a request operation

```typescript
image.buffer(); // -> ArrayBuffer
```

#### asFile(filePath: string)

Stores the image in the File data type and return the file. It also stores the image in local directory

```typescript
image.asFile("filePath"); // -> File (filePath)
```

#### asImageSrc

Returns the image which can be used as source to HTML tag.

```typescript
image.asImageSrc(); // -> string
```

#### base64

Returns the base64 string after request operation

```typescript
image.base64(); // -> string
```

#### blob

Returns the blob after request operation

```typescript
image.blob(); // -> Blob
```

### Some More Usage Examples

#### Variations

```typescript
import { client, Status, VariationStyle } from "imaginesdk";

// Create a client with your API key
const imagine = client("<YOUR_API_KEY>");

const main = async () => {
  // Call the variations method with the text and image
  const response = await imagine.variations(
    `a cute anime girl in a forest`, // Prompt
    "anime-girl.png", // Can pass absolute or relative path, image url, or blob of image
    {
      style: VariationStyle.ANIME,
    }
  );

  // Check if the response is OK
  if (response.status() === Status.OK) {
    const image = response.getOrThrow();
    image.asFile("output.png");
  } else {
    console.log(response.errorOrThrow());
  }
};

//  Run the main function
main();
```

**Result**:

![Variate](https://vyroai.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7a2a54f2-c762-45ea-a1bd-c655ed421caa%2Fbanner_2.png?table=block&id=d60f4549-e35c-4044-afaa-7cd9d17803a2&spaceId=60572bb8-cbeb-42ba-b882-c88845384d44&width=2000&userId=&cache=v2)

#### In-Painting

```typescript
import { client, Status } from "imaginesdk";

// Create a client with your API key
const imagine = client("<YOUR_API_KEY>");

const main = async () => {
  // Call the method of the inpaint with the text and images
  const response = await imagine.inpaint(
    `woman sitting next to a teddy bear`, // Prompt text
    "couple.png", // Can pass absolute or relative path, image url, or blob of image
    "mask.png" // Can pass absolute or relative path, image url, or blob of mask
  );

  // Check if the response is OK
  if (response.status() === Status.OK) {
    const image = response.getOrThrow();
    image.asFile("output.png");
  } else {
    console.log(response.errorOrThrow());
  }
};

//  Run the main function
main();
```

**Result**:
![InPainting](https://vyroai.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F7017cedd-aeda-4a3e-ad09-54eb8b93399d%2Finpainting.jpg?table=block&id=1bc58f0f-1d7f-465f-b414-200ceb2464b1&spaceId=60572bb8-cbeb-42ba-b882-c88845384d44&width=2000&userId=&cache=v2)

## Support

If you run into any version issues, please contact us at [api.imagine@vyro.ai](api.imagine@vyro.ai) or [support.imagine.api](support.imagine@vyro.ai)

## License

This project is licensed under the Apache-2.0 license.
