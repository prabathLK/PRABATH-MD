import NodeApiRequest, { ApiResponse } from '../src/index';

describe('NodeApiRequest', () => {

    // Tests that the class handles errors in the request properly
    it('should handle errors in the request properly', () => {
      // Mock the request function to simulate an error
      const mockRequest = jest.fn((options, callback) => {
        callback(new Error("Request error"), null, null);
      });

      // Replace the original request function with the mock
      jest.mock("request", () => mockRequest);

      // Call the sendRequest method with options
      const options:any = { url: "https://example.com", method: "GET" };
      return NodeApiRequest.sendRequest(options).catch((error) => {
        // Assert that the mock request function was called with the correct options
        expect(mockRequest).toHaveBeenCalledWith(
          {
            url: "https://example.com",
            method: "GET",
            headers: undefined,
            body: undefined,
            json: true,
          },
          expect.any(Function)
        );

        // Assert that the error is handled properly
        expect(error).toEqual(new Error("Request error"));
      });
    });
});
