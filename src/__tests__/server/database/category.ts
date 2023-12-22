import { createCategory } from '../../../server/database/category';

describe('createCategory', () => {
  it('should create a category', async () => {
    // Arrange
    const categoryInput = {
      name: 'test',
      parentId: 1,
      menuId: "clpgjbyfk0009unxh5pkshzbg",
    };

    // Act
    const result = await createCategory(categoryInput);

    // Assert
    // replace with your own expectations
    expect(result).toBeDefined();
    expect(result.name).toBe("test");
  });
});