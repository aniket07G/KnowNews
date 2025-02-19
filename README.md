# 🚀 Setup Instructions
This guide walks you through setting up the MyKisan React Native project, installing dependencies, and handling common issues.

## Create a New React Native Project
To set up the project, run the following command:
npx @react-native-community/cli init MyKisan


This will initialize a new React Native project named MyKisan (you can name any you want just to explain i keep my project name).

Once the installation is complete, navigate into the project directory:
cd MyKisan

Then, start the development server and launch the app on an Android device or emulator:
npm run android

## Troubleshooting Build Failures
If the build fails, try cleaning the Gradle cache and rebuilding the project:

cd android && gradlew clean

After cleaning, go back to the main project directory and rerun the build:

cd ..
npm run android

## 🔹 Ensure Node.js and npm Are Up to Date
Before proceeding, make sure that both Node.js and npm are up to date, as outdated versions may cause compatibility issues.