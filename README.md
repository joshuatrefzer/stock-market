# StockMarket

Welcome to the **StockMarket** repository! This project is a web application that allows you to monitor and analyze stock market data. You can select stocks, visualize their performance on a dashboard, customize the time intervals for displaying data and compare multiple stocks side by side. 

![StockMarket Dashboard](/src/assets/stock-market.png) 

## APIs and Libraries

### Polygon.io API
This application relies on the Polygon.io API to fetch stock market data. Ensure that your internet connection is active to enable API requests. You will also need an API key from Polygon.
You can easily get one on their [homepage](https://polygon.io/docs/stocks/getting-started).

### Chart.js
The application utilizes Chart.js to render responsive and interactive charts that display stock data. Chart.js supports various chart types, which makes it ideal for visualizing stock performance. In this repository only the line chart is used.

## Getting Started

### Settings

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [Angular CLI](https://angular.io/cli) (version 17.0.0 or higher)

### Installation

1. Clone the repository:
    ```bash
    git clone git@github.com:joshuatrefzer/stock-market.git
    ```
2. Navigate to the project directory:
    ```bash
    cd stock-market
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

### Development Server
To start the development server, run the following command:

```bash
ng serve
