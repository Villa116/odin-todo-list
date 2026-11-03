import './style.css';
import { DOMController } from './domController.js';

// Initialize the user interface on page load
document.addEventListener('DOMContentLoaded', () => {
  DOMController.init();
})