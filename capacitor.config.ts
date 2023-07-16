import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'my.recipe.app',
  appName: 'RecipeApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorSQLite: {
      "iosDatabaseLocation": "Library/CapacitorDatabase"
    }
  }
};

export default config;
