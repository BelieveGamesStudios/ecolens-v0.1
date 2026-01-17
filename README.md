# EcoLens

EcoLens is an AI-powered web application designed to promote sustainability by helping users identify objects and understand their environmental impact. Using real-time object detection directly in the browser, EcoLens provides instant feedback on carbon footprint, recycling ratings, and eco-friendly tips.

## Features

-   **Real-Time Object Detection**: Uses TensorFlow.js and MobileNet to identify objects via the device camera.
-   **Instant Eco-Analysis**: Displays carbon footprint, recycling rating (A-F), and disposal instructions for detected items.
-   **Broad Recognition Support**: Detects everyday items including:
    -   **Plastic**: Bottles, bags, containers.
    -   **Electronics**: Laptops, phones, keyboards.
    -   **Paper**: Books, envelopes, cartons, packets.
    -   **Metal**: Cans, tins, keys.
-   **Privacy-First**: All processing happens locally on the client device; no video data is sent to a server.
-   **Responsive Design**: Mobile-first UI optimized for handheld usage.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **UI Library**: [React 19](https://react.dev/)
-   **AI/ML**: [TensorFlow.js](https://www.tensorflow.org/js) with [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Styling**: CSS Modules / Global CSS

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm, yarn, pnpm, or bun

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ecolens.git
    cd ecolens
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser.

    > **Note**: Camera access is required. If testing on a mobile device on the same network, ensure you access via HTTPS or localhost (some browsers block camera access on insecure HTTP connections).

## Usage

1.  **Launch the App**: Open the web app on your mobile device or laptop.
2.  **Grant Permissions**: Allow camera access when prompted.
3.  **Scan Objects**: Point the camera at an object.
4.  **View Data**:
    -   The app will display "AI VISION" at the top.
    -   When an object is recognized (e.g., a "Water Bottle"), a card will pop up at the bottom showing:
        -   **Name**: Identification of the object.
        -   **Rating**: Efficiency rating (A = Good, F = Bad).
        -   **Carbon**: Estimated CO2 footprint.
        -   **Recycle**: Instructions on how to recycle or dispose of the item.
        -   **Tip**: A quick tip for a more sustainable choice.

## Customization

The eco-data mapping is located in `utils/ecoDatabase.js`. You can modify this file to add new objects or update the environmental data for existing ones.

## License

This project is licensed under the MIT License.
