# Project Overview: Elancia Route Calculator

## Introduction
The **Elancia Route Calculator** is a web-based utility designed for players of the game "Elancia". It helps players plan and calculate their character's growth route by simulating job changes and stat adjustments. The application uses a linked list data structure to manage the sequence of jobs and their impact on character statistics.

## Key Features
- **Job Route Planning**: Users can add jobs to a sequence (route) to simulate their character's progression.
- **Stat Calculation**: Automatically calculates the changes in stats (STR, INT, AGI, VIT) based on job points and specific job rules.
- **Interactive Table**: A dynamic table interface allows users to view and adjust their route.
- **Point Adjustment**: Users can fine-tune job points for each job in the route to see how it affects their stats.
- **Share Functionality**: Users can share their calculated routes as images.
- **Save/Load**: Routes are automatically saved to session storage and can be restored via URL query parameters.

## Core Concepts
- **Route**: A sequence of jobs a character takes.
- **Job Point (JobPo)**: Points accumulated in a specific job, which influence stat growth.
- **Stats**: The four main attributes (STR, INT, AGI, VIT) that change based on the job and job points.
- **Route Linked List**: The underlying data structure that maintains the order of jobs and propagates stat changes dynamically.
