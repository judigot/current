export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export default async (): Promise<User[] | undefined> => {
  let data: User[] | undefined = undefined;
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      // *GET, POST, PATCH, PUT, DELETE
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*", // Same as axios
        "Content-Type": "application/json",
      },
      // For POST, PATCH, and PUT requests
      // body: JSON.stringify({ key: "value" }),
    });
    if (response?.ok) {
      data = await response.json();
    } else {
      throw new Error(`HTTP Error: ${response}`);
    }
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(`There was an error: ${error}`);
    }
    if (error instanceof Error) {
      throw new Error(`There was an error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      throw new Error(`Syntax Error: ${error}`);
    }
  } finally {
  }

  // Success
  if (data) {
    return data;
  }
};
