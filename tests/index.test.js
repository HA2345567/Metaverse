
const axios2 = require('axios');
const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"




const axios = {
    post: async (...args) => {
        try {
            const response = await axios2.post(...args);
            return response;
        } catch (error) {
            if (error.response) {
                throw {
                    response: {
                        status: error.response.status,
                        data: error.response.data
                    }
                };
            }
            throw new Error('Network error');
        }
    },
    put: async (...args) => {
        try {
            const response = await axios2.put(...args);
            return response;
        } catch (error) {
            if (error.response) {
                throw {
                    response: {
                        status: error.response.status,
                        data: error.response.data
                    }
                };
            }
            throw new Error('Network error');
        }
    },
    get: async (...args) => {
        try {
            const response = await axios2.get(...args);
            return response;
        } catch (error) {
            if (error.response) {
                throw {
                    response: {
                        status: error.response.status,
                        data: error.response.data
                    }
                };
            }
            throw new Error('Network error');
        }
    },
    delete: async (...args) => {
        try {
            const response = await axios2.delete(...args);
            return response;
        } catch (error) {
            if (error.response) {
                throw {
                    response: {
                        status: error.response.status,
                        data: error.response.data
                    }
                };
            }
            throw new Error('Network error');
        }
    }
};


 // 🔁 change this to your actual backend URL // Change if needed


describe("Authentication", () => {
    test("User is able to sign up only once", async () => {
        const username = `harsh${Date.now()}${Math.floor(Math.random() * 100000)}@example.com`;
        const password = "12345678";

        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            types: "admin"  // ✅ 'types' not 'type'
        });
        expect(response.status).toBe(200);

        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
                types: "admin"
            });
            throw new Error("Signup should have failed but didn't");
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("Signup request fails if the username is empty", async () => {
        const password = "12345678";

        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username: "",
                password,
                types: "admin"
            });
            throw new Error("Signup should have failed due to empty username");
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("Signin succeeds if the username and password are correct", async () => {
        const username = `harsh${Math.floor(Math.random() * 10000)}@example.com`;
        const password = "12345678";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            types: "admin"
        });
        expect(signupResponse.status).toBe(200);

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined();
    });

    test("Signin fails if the username and password are incorrect", async () => {
        const username = `wrong${Math.floor(Math.random() * 10000)}@example.com`;
        const password = "wrongpass";

        try {
            await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            });
            throw new Error("Signin should have failed with wrong credentials");
        } catch (error) {
            expect(error.response.status).toBe(403);
        }
    });
});
describe("User Metadata endpoints", () => {
  let token;
  let avatarId;

  beforeAll(async () => {
    const username = `harsh-${Math.random()}`;
    const password = "198729";

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password,
    });
    token = response.data.token;

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      name: "Timmy"
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    avatarId = avatarResponse.data.avatarId;
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
        avatarId: "invalid-avatar-id"
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }
  });

  test("User can update their metadata with a valid avatar id", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(response.status).toBe(200);
  });

  test("User is not able to update their metadata if the auth header is not present", async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
        avatarId
      });
    } catch (err) {
      expect(err.response.status).toBe(403);
    }
  });
});


describe("User avatar information",  () => {
    let avatarId;
    let token;
    let userId;
    beforeAll(async () => {
        const username = `harsh-${Math.random()}`
        const password = "122333";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin",
        })
        userId = signupResponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        })

        token = response.data.token;
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        avatarId = avatarResponse.data.avatarId;



    })

    test("Get back avatar information for a user", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);


    })

    test("Avaliable avatars lists the recently created avatar", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined();
    })
});

describe("Space information ",  () => {
    let mapId;
    let element1Id;
    let element2Id;
    let token;
    let adminId;
    let adminToken;
    let userId;
    let userToken;
    beforeAll(async () => {
        const username = `harsh-${Math.random}`;
        const password = "123233";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });
        adminId = signupResponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });

        adminToken = response.data.token;

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        });
        userId = userSignupResponse.data.userId;



        const userSigninresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password,
        });

        userToken = userSigninresponse.data.token;

        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element `, {

            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element `, {

            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        element1Id = element1.data.id
        element2Id = element2.data.id

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            }, {
                elementId: element1Id,
                x: 18,
                y: 20
            }, {
                elementId: element2Id,
                x: 19,
                y: 20
            }
            ]


        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        })

        mapId = map.data.id;
    })

    test("User is able to create a space", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(response.data.spaceId).toBeDefined();
    })
    test("User can create a space without a mapId (empty space)", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(response.data.spaceId).toBeDefined();
    })
    test("User cannot create a space without a mapId and dimensions", async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/space`, {
                "name": "Test",
            }, {
                headers: {
                    authorization: `Bearer ${userToken}`
                }
            })
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    })
    test("User is not able to delete a space that doesn't exist", async () => {
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
                headers: {
                    authorization: `Bearer ${userToken}`
                }
            })
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    })
    test("User is able to delete a space that does exist", async () => {
        const createResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${createResponse.data.spaceId}`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        expect(deleteResponse.status).toBe(200)
    })
    test("User should not be able to delete a space created by another user", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        })
        try {
            await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
                headers: {
                    authorization: `Bearer ${adminToken}`
                }
            })
        } catch (error) {
            expect(error.response.status).toBe(403)
        }
    })
    test("Admin has no spaces initially", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });
        expect(response.data.spaces.length).toBe(0)
    })
    test("User can create and list a space", async () => {
        const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });
        const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.data.spaceId)
        expect(response.data.spaces.length).toBe(1);
        expect(filteredSpace).toBeDefined();
    })
});

describe("Arena information", () => {
    let mapId;
    let element1Id;
    let element2Id;
    let adminId;
    let adminToken;
    let userId;
    let userToken;
    let spaceId;

    beforeAll(async () => {
        const username = `harsh-${Math.random()}`;
        const password = "234232";

        const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin",
        });
        adminId = signupResponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        });
        adminToken = response.data.token;

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user",
        });
        userId = userSignupResponse.data.userId;

        const userSigninresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password,
        });
        userToken = userSigninresponse.data.token;

        const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });
        element1Id = element1.data.id;

        const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });
        element2Id = element2.data.id;

        const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: element1Id,
                x: 20,
                y: 20
            }, {
                elementId: element1Id,
                x: 18,
                y: 20
            }, {
                elementId: element2Id,
                x: 19,
                y: 20
            }]
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });
        mapId = map.data.id;

        const space = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                authorization: `Bearer ${userToken}`
            }
        });
        spaceId = space.data.spaceId;
    });

    test("Incorrect spaceId returns a 400", async () => {
        try {
            await axios.get(`${BACKEND_URL}/api/v1/space/123aldflkja`, {
                headers: {
                    "authorization": `Bearer ${userToken}`
                }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("Correct spaceId returns all the elements", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(response.data.dimensions).toBe("100x200");
        expect(response.data.elements.length).toBe(3);
    });

    test("Delete endpoint is able to delete element", async () => {
        // Get current elements
        const getResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        const elementIdToDelete = getResponse.data.elements[0].id;

        // Delete the element
        await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            data: {
                spaceId: spaceId,
                elementId: elementIdToDelete
            },
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });

        // Get elements again
        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(newResponse.data.elements.length).toBe(2);
    });

    test("Adding an element fails if the element lies outside the dimensions", async () => {
        try {
            await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
                "elementId": element1Id,
                "spaceId": spaceId,
                "x": 100000,
                "y": 200000,
            }, {
                headers: {
                    "authorization": `Bearer ${userToken}`
                }
            });
        } catch (error) {
            expect(error.response.status).toBe(400);
        }
    });

    test("Adding an element works as expected", async () => {
        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50,
            "y": 20,
        }, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                "authorization": `Bearer ${userToken}`
            }
        });
        expect(newResponse.data.elements.length).toBe(3);
    });
});

describe("Admin Endpoints", () => {
    let adminToken, userToken, elementId;

    beforeAll(async () => {
        const base = `harsh-${Math.random()}`;
        const password = "234232";

        // Admin
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: base,
            password,
            type: "admin",
        });
        const signinAdmin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: base,
            password,
        });
        adminToken = signinAdmin.data.token;

        // User
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: `${base}-user`,
            password,
            type: "user",
        });
        const signinUser = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: `${base}-user`,
            password,
        });
        userToken = signinUser.data.token;
    });

    test("User is not able to access admin endpoints", async () => {
        const endpoints = [
            ["element", { imageUrl: "https://image.png", width: 1, height: 1, static: true }],
            ["map", { thumbnail: "https://thumb.png", dimensions: "100x200", name: "room", defaultElements: [] }],
            ["avatar", { imageUrl: "https://avatar.png", dimensions: "100x200", name: "avatar", defaultElements: [] }],
        ];

        for (const [path, body] of endpoints) {
            try {
                await axios.post(`${BACKEND_URL}/api/v1/admin/${path}`, body, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });
            } catch (err) {
                expect(err.response.status).toBe(403);
            }
        }

        // Testing update (with dummy id)
        try {
            await axios.post(`${BACKEND_URL}/api/v1/admin/element/1234`, {
                imageUrl: "https://image.png",
                width: 1,
                height: 1,
                static: true,
            }, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
        } catch (err) {
            expect(err.response.status).toBe(403);
        }
    });

    test("Admin is able to hit admin endpoints", async () => {
        // Create element
        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://image.png",
            width: 1,
            height: 1,
            static: true,
        }, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(elementResponse.status).toBe(200);
        elementId = elementResponse.data.id;

        // Create map
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            thumbnail: "https://thumb.png",
            dimensions: "100x200",
            name: "room",
            defaultElements: [],
        }, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(mapResponse.status).toBe(200);

        // Create avatar
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://avatar.png",
            dimensions: "100x200",
            name: "avatar",
            defaultElements: [],
        }, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(avatarResponse.status).toBe(200);
    });

    test("Admin is able to update an element", async () => {
        // Create first
        const create = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            imageUrl: "https://image.com/initial.png",
            width: 2,
            height: 2,
            static: false,
        }, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const id = create.data.id;
        expect(create.status).toBe(200);

        // Now update
        const update = await axios.post(`${BACKEND_URL}/api/v1/admin/element/${id}`, {
            imageUrl: "https://image.com/updated.png",
            width: 3,
            height: 3,
            static: true,
        }, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        expect(update.status).toBe(200);
    });
});

describe("WebSocket tests", () => {
  let adminToken, adminId, userToken, userId;
  let element1Id, element2Id, spaceId;
  let ws1, ws2;
  let ws1Messages = [];
  let ws2Messages = [];
  let userx, usery, adminx, adminy;

  function waitForAndPopLatestMessage(messageArray) {
    return new Promise((resolve) => {
      if (messageArray.length > 0) {
        resolve(messageArray.shift());
      } else {
        const interval = setInterval(() => {
          if (messageArray.length > 0) {
            clearInterval(interval);
            resolve(messageArray.shift());
          }
        }, 100);
      }
    });
  }

  async function setupHTTP() {
    const username = `harsh-${Math.random()}`;
    const password = "123456";

    const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: "admin"
    });
    adminId = adminSignupResponse.data.userId;

    const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    });
    adminToken = adminSigninResponse.data.token;

    const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username: username + "-user",
      password,
      type: "user"
    });
    userId = userSignupResponse.data.userId;

    const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username: username + "-user",
      password
    });
    userToken = userSigninResponse.data.token;

    const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      imageUrl: "https://image1.com",
      width: 1,
      height: 1,
      static: true
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    element1Id = element1Response.data.id;

    const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      imageUrl: "https://image2.com",
      width: 1,
      height: 1,
      static: true
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    element2Id = element2Response.data.id;

    const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
      thumbnail: "https://thumbnail.com/a.png",
      dimensions: "100x200",
      name: "100 person interview room",
      defaultElements: [
        { elementId: element1Id, x: 20, y: 20 },
        { elementId: element1Id, x: 18, y: 20 },
        { elementId: element2Id, x: 19, y: 20 }
      ]
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const spaceResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/space`, {
      name: "test-space",
      mapId: mapResponse.data.id
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    spaceId = spaceResponse.data.id;
  }

  async function setupWS() {
    ws1 = new WebSocket(WS_URL);
    await new Promise((res) => { ws1.onopen = res; });

    ws2 = new WebSocket(WS_URL);
    await new Promise((res) => { ws2.onopen = res; });

    ws1.onmessage = (event) => {
      ws1Messages.push(JSON.parse(event.data));
    };
    ws2.onmessage = (event) => {
      ws2Messages.push(JSON.parse(event.data));
    };
  }

  beforeAll(async () => {
    await setupHTTP();
    await setupWS();
  });

  test("Get back ack for joining the space", async () => {
    ws1.send(JSON.stringify({
      type: "join",
      payload: {
        spaceId,
        token: adminToken
      }
    }));
    const message1 = await waitForAndPopLatestMessage(ws1Messages);

    ws2.send(JSON.stringify({
      type: "join",
      payload: {
        spaceId,
        token: userToken
      }
    }));
    const message2 = await waitForAndPopLatestMessage(ws2Messages);
    const message3 = await waitForAndPopLatestMessage(ws1Messages);

    expect(message1.type).toBe("space-joined");
    expect(message2.type).toBe("space-joined");
    expect(message1.payload.users.length).toBe(0);
    expect(message2.payload.users.length).toBe(1);
    expect(message3.type).toBe("user-join");

    expect(message3.payload.x).toBe(message2.payload.spawn.x);
    expect(message3.payload.y).toBe(message2.payload.spawn.y);
    expect(message3.payload.userId).toBe(userId);

    adminx = message1.payload.spawn.x;
    adminy = message1.payload.spawn.y;
    userx = message2.payload.spawn.x;
    usery = message2.payload.spawn.y;
  });

  test("User should not be able to move across the boundary", async () => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: 1000000,
        y: 1000000
      }
    }));
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminx);
    expect(message.payload.y).toBe(adminy);
  });

  test("User should not move two blocks at once", async () => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: adminx + 2,
        y: adminy
      }
    }));
    const message = await waitForAndPopLatestMessage(ws1Messages);
    expect(message.type).toBe("movement-rejected");
    expect(message.payload.x).toBe(adminx);
    expect(message.payload.y).toBe(adminy);
  });

  test("Correct movement should be broadcasted to the other sockets", async () => {
    ws1.send(JSON.stringify({
      type: "movement",
      payload: {
        x: adminx + 1,
        y: adminy,
        userId: adminId
      }
    }));
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("movement");
    expect(message.payload.x).toBe(adminx + 1);
    expect(message.payload.y).toBe(adminy);
    expect(message.payload.userId).toBe(adminId);
  });

  test("If a user leaves, the other gets a leave event", async () => {
    ws1.close();
    const message = await waitForAndPopLatestMessage(ws2Messages);
    expect(message.type).toBe("user-left");
    expect(message.payload.userId).toBe(adminId);
  });
});

