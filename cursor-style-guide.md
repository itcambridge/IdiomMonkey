# Style Guide for Cursor AI

## General Guidelines
- **Adhere to SOLID Principles**
  - Ensure each class or function has a single responsibility.
  - Make modules extensible without modifying existing code.
  - Use interfaces to segregate unrelated methods.

- **Follow DRY Principles**
  - Avoid duplicate logic by creating reusable components.
  - Refactor repetitive code into shared utility functions.

- **Commenting**
  - Document the purpose of each module, class, and key function.
  - Use meaningful comments to explain complex logic.

## Code Structure
- Use a modular architecture:
  - **Frontend:**
    - Place reusable UI components in a `components/` directory.
    - Separate logic into `hooks/` or `utils/` directories.
  - **Backend:**
    - Organize feature-specific logic into services and controllers.
    - Keep database models in a `models/` directory.

- Use consistent naming conventions:
  - Variables: `camelCase`
  - Functions: `camelCase`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`

## Formatting
- **Indentation:** Use 2 spaces per indentation level.
- **Line Length:** Limit to 80 characters where possible.
- **Braces:** Always use braces for conditionals and loops, even single-line.
- **Whitespace:**
  - Leave one blank line between functions.
  - Avoid trailing whitespace.

## Testing Guidelines
- Write unit tests for every function.
- Mock external dependencies in tests.
- Use meaningful test names, e.g., `shouldReturnFeatureListWhenValidProject`.

## Error Handling
- Use try/catch blocks for async functions.
- Log errors meaningfully:
  ```javascript
  console.error(`Error in FeatureService: ${error.message}`);
