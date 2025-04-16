# Directus Collection Clone Extension

This extension adds the ability to clone collections within your Directus instance. It provides a user-friendly interface that allows administrators to duplicate any non-system collection with all its fields and relations.

## Features

- Clean and intuitive user interface
- Clones all collection fields and properties
- Preserves relations between collections
- Filters out system collections (starting with 'directus_')
- Real-time feedback with success and error states
- Easy access through the module sidebar

## Installation

### Prerequisites

- Directus v11.0.0 or higher
- Node.js v18 or higher
- npm v8 or higher

### Method 1: Marketplace Installation (Recommended)

1. Log in to your Directus admin panel
2. Navigate to Settings > Marketplace
3. Search for "Collection Clone" in the marketplace
4. Click "Install Extension" next to the Collection Clone extension
5. Once installed, the extension endpoint is immediately available
6. To get the UI for cloning collections you have to go to settings and enable the "Clone Collection" module

### Method 2: Manual Installation

1. Clone or download this repository
2. Navigate to the extension directory
3. Install the extension:

   ```bash
   npm install directus_bundle_collection_clone
   ```

. Restart your Directus instance

## Usage

1. Log in to your Directus admin panel
2. Look for "Clone Collection" in the module sidebar
3. Click on the module to open the collection cloning interface
4. Browse the list of available collections
5. Click the clone button next to the collection you want to duplicate
6. Enter a name for the new collection
7. Click "Clone" to start the cloning process
8. You'll receive feedback on the success or failure of the operation

## Structure

The extension consists of two main components:

1. **Module Extension**: Provides the user interface for cloning collections
   - Located in `src/directus_module_collection_clone/`
   - Built with Vue.js

2. **Endpoint Extension**: Handles the backend logic for cloning collections
   - Located in `src/directus_endpoint_collection_clone/`
   - Exposes the `/collection_clone/:collection/:newCollection` endpoint
   - Uses Directus services to clone collections

## Configuration

No additional configuration is required for this extension to work.

## Troubleshooting

### Common Issues

- **Error: Collection already exists** - You're trying to create a collection with a name that already exists
- **Error: Permission denied** - Your role doesn't have permission to create collections
- **Extensions not loading** - Make sure the extension is properly built and placed in the correct directory

## Contributing

Interested in contributing? Check out our [CONTRIBUTING.md](CONTRIBUTING.md) file for development setup, workflow guidelines, and coding standards.

## License

[MIT License](LICENSE)

---

**Note:** This extension is not an official Directus extension. Use at your own risk.
