
describe('Categories API', () => {

  it('should be able to list all categories', async () => {

    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);

  });

}