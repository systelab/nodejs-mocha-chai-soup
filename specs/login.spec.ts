import { SeedCppApp, SeedCppRestApi } from '@apps';
import { RESTAPI, Request, RequestMethod, HttpHeader, Response, StatusCode } from '@restapi';


describe('Login', async () =>
{
    let app: SeedCppApp;
    let api: SeedCppRestApi;

    before(async() =>
    {
        app = new SeedCppApp();
        await app.start();
        api = app.getRESTAPI();
    });

    after(async() =>
    {
        app.close();
    });

    it('should succeed when credentials are valid (PASS)', async() =>
    {
        const username: string = "Systelab";
        const password: string = "Systelab";
        const request: Request = {
            appURI: api.getApplicationURI(),
            resourceURI: SeedCppRestApi.USERS_LOGIN,
            method: RequestMethod.POST,
            headers: [ {name: HttpHeader.ContentType, value: "application/x-www-form-urlencoded"} ],
            body: `login=${username}&password=${password}`
        }

        const response: Response = await RESTAPI.sendRequest(request);
        RESTAPI.expectStatus(response, StatusCode.OK);
        RESTAPI.expectHeaderPresent(response, HttpHeader.Authorization);
        RESTAPI.expectBody(response, {});
    });

    it('should succeed when credentials for another user are valid (FAIL)', async() =>
    {
        const username: string = "AnotherUser";
        const password: string = "TheValidPassword";
        const request: Request = {
            appURI: api.getApplicationURI(),
            resourceURI: SeedCppRestApi.USERS_LOGIN,
            method: RequestMethod.POST,
            headers: [ {name: HttpHeader.ContentType, value: "application/x-www-form-urlencoded"} ],
            body: `login=${username}&password=${password}`
        }

        const response: Response = await RESTAPI.sendRequest(request);
        RESTAPI.expectStatus(response, StatusCode.OK);
        RESTAPI.expectHeaderPresent(response, HttpHeader.Authorization);
        RESTAPI.expectBody(response, {});
    });

    it('should fail when given user does not exist (PASS)', async() =>
    {
        const username: string = "WrongUser";
        const password: string = "Systelab";
        const request: Request = {
            appURI: api.getApplicationURI(),
            resourceURI: SeedCppRestApi.USERS_LOGIN,
            method: RequestMethod.POST,
            headers: [ {name: HttpHeader.ContentType, value: "application/x-www-form-urlencoded"} ],
            body: `login=${username}&password=${password}`
        }

        const response: Response = await RESTAPI.sendRequest(request);
        RESTAPI.expectStatus(response, StatusCode.UNAUTHORIZED);
        RESTAPI.expectHeaderNotPresent(response, HttpHeader.Authorization);
        RESTAPI.expectBody(response, {});
    });

    xit('should fail when given password is invalid (DISABLED)', async() =>
    {
        const username: string = "Systelab";
        const password: string = "WrongPassword";
        const request: Request = {
            appURI: api.getApplicationURI(),
            resourceURI: SeedCppRestApi.USERS_LOGIN,
            method: RequestMethod.POST,
            headers: [ {name: HttpHeader.ContentType, value: "application/x-www-form-urlencoded"} ],
            body: `login=${username}&password=${password}`
        }

        const response: Response = await RESTAPI.sendRequest(request);
        RESTAPI.expectStatus(response, StatusCode.UNAUTHORIZED);
        RESTAPI.expectHeaderNotPresent(response, HttpHeader.Authorization);
        RESTAPI.expectBody(response, {});
    });

});