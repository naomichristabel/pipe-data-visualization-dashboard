export const PIPE_CONSTANTS = {
    pipeOuterRadius: 10,
    pipeInnerRadius: 9,
    minAcceptableThreshold: 18.96,
    pipeSectionScaleFactor: 1, // Needs to be calculated or set based on spacing between Pipe Section IDs
    circumferenceScaleFactor: 2, // Needs to be calculated or set based on spacing between Circumference IDs
}

// pipeSectionScaleFactor = 2 for with circumference IDs file, 12 for points only along X-axis

export const COLOURS = {
    amber: '#FF5733',
    green: '#04dc04',
    grey: '#888',
    mediumGrey: '#6F6F6F',
    darkGrey: '#292929',
    lightGrey: '#DDD',
    veryLightGrey: "#EEE",
    red: '#FF0000',
    yellow: '#FFFF00',
    purple: '#9c27b0',
    white: '#FFF',
    darkBlue: '#1b2351',
    black: '#000',
    blue: '#0000FF',
    darkGreyBlue: '#153448',
    greyBlue: '#3C5B6F',
    darkBeige: '#948979',
    lightBeige: '#DFD0B8'
}

export const LABEL = {
    strongestDecline: 'Strongest Decline',
    currentTrendTitle: 'Trend Analysis',
    upcomingTrendTitle: 'Predictive Trend Analysis',
    trendTabs: {
        past: "Past",
        current: "Current",
        upcoming: "Upcoming"
    },
    direction: {
        n: "North",
        s: "South",
        e: "East",
        w: "West",
        nw: "North-West",
        sw: "South-West",
        ne: "North-East",
        se: "South-East",
        full: "Full"
    }
}

export const YEARS = {
    past: ['2005', '2010', '2015', '2020'],
    current: '2024',
    upcoming: ['2025', '2030', '2035', '2040']
}

export const MARGIN = { top: 10, right: 10, bottom: 50, left: 50 };

export const COLOR_LEGEND_HEIGHT = 60;

export const COLORS = [
    "#ff0000", // Red
    "#f05336", // Orange
    // "#e29421", // Tangerine
    // "#FFEEA6", // Light Yellow
    "#ffd73e", // Yellow
    // "#FFEF00", // Bright Yellow
    // "#DAFA59", // Yellow Green
    "#C7FF72", // Light Green
    // "#33D228", // Green
    "#4ab04a", // Medium Green
    "#1D8B15", // Dark Green
];

export const THRESHOLDS = [
    0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0
    //0, 0.01, 0.02, 0.03, 0.09, 0.1, 0.15, 0.25, 0.4, 0.5, 1
// 16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23
// -1, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1
//-0.50, -0.45, -0.40, -0.35, -0.30, -0.25, -0.20, -0.15, -0.10, -0.05, 0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50
];
