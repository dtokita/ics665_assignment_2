// Entirely designed by dtokita, except where noted

// Define size parameters for animation space
let width = 1200;
let height = 1000;
let margin = 100;
let blockMargin = 10;
let blockWidth = 0;

// Define indices and parameters that get tracked in the header
var a = 0;
var b = 0;
var steps = 0;
var swaps = 0;

// Globally initialize arrays for ease of use
var unsortedArray = [];
var sortedArray = [];

var unsortedBlocks = [];
var unsortedText = [];

// Create SVG space for animation
var svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

// Function called to create a specificed number of blocks to animate
function createBlocks() {
            
  // Clear animation space
  d3.select('svg').selectAll('*').remove();

  // Get number of blocks
  let size = parseInt(document.getElementById('size').value);

  // Calculate the size of blocks based on the number of blocks to fit into animation space
  blockWidth = ((width - (2 * margin)) / (size + 1)) - blockMargin;

  // Reinitialize the sorting parameters
  a = 0;
  b = 0;
  steps = 0;
  swaps = 0;

  sortedArray = [];
  unsortedArray = [];
  unsortedBlocks = [];
  unsortedText = [];

  document.getElementById('step-number').value = steps;
  document.getElementById('index-a').value = a;
  document.getElementById('index-b').value = b;
  document.getElementById('swap-number').value = swaps;

  // Generate the random array in JavaScript to be sorted
  unsortedArray = d3.shuffle(d3.range(1, size + 1));

  // Create a number of blocks based on user input on the webpage
  for(var i = 0; i < size; i++) {
    var tempBlock = svg.append('rect').attr('width', blockWidth).attr('height', blockWidth)
        .attr('x', blockWidth * (i + 1)).attr('y', margin);

    var tempText = svg.append('text').attr('x', blockWidth * (i + 1) + (0.5 * blockWidth)).attr('y', margin + (0.5 * blockWidth))
        .attr('text-anchor', 'middle').attr('dy', '.35em').text(unsortedArray[i]);

    unsortedBlocks.push(tempBlock);
    unsortedText.push(tempText);
  }
}

// Function to be called to animate the swapping of blocks on the webpage
// Pass in the two blocks along with the distance that the two blocks need to be swapped, a -1 distance corresponds to no animation
// This function also increments the swap counter
function swapBlocks(block1, block2, dist) {
            
  // Get starting X position of blocks
  let block1StartPosX = parseFloat(block1.attr('x'));
  let block2StartPosX = parseFloat(block2.attr('x'));

  // No swap animation, in place for consistency in flow of code
  if (dist == -1) {
    block1.transition().attr('y', margin).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', block1StartPosX).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin).duration(200);
      });
    });

    block2.transition().attr('y', margin).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', block2StartPosX).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin).duration(200);
      });
    });
  } else {
              
    // Count the number of swaps and display to header
    swaps++;
    document.getElementById('swap-number').value = swaps;

    // Animate the swapping of blocks
    block1.transition().attr('y', margin - blockWidth).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', (block1StartPosX + dist)).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin).duration(200);
      });
    });

    block2.transition().attr('y', margin + blockWidth).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', (block2StartPosX - dist)).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin).duration(200);
      });
    });
  }
}

// Similar to the animation of the blocks, corresponding animation to the text within the blocks occur
function swapTexts(text1, text2, dist) {
            
  // Get starting text positions
  let text1StartPosX = parseFloat(text1.attr('x'));
  let text2StartPosX = parseFloat(text2.attr('x'));

  // No swap animation, kept for consistency in code flow
  if (dist == -1) {
    text1.transition().attr('y', margin + (0.5 * blockWidth)).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', text1StartPosX).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin + (0.5 * blockWidth)).duration(200);
      });
    });

    text2.transition().attr('y', margin + (0.5 * blockWidth)).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', text2StartPosX).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin + (0.5 * blockWidth)).duration(200).on('end', function() {
          if (a < parseInt(document.getElementById('size').value)) {
            bubbleSortStep();
          }
        });
      });
    });
  } else {
         
    // Animate the swapping of text
    text1.transition().attr('y', margin - (0.5 * blockWidth)).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', (text1StartPosX + dist)).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin + (0.5 * blockWidth)).duration(200);
      });
    });

    text2.transition().attr('y', margin + (1.5 * blockWidth)).duration(200).on('end', function() {
      d3.select(this).transition().attr('x', (text2StartPosX - dist)).duration(200).on('end', function() {
        d3.select(this).transition().attr('y', margin + (0.5 * blockWidth)).duration(200).on('end', function() {
          if (a < parseInt(document.getElementById('size').value)) {
            bubbleSortStep();
          }
        });
      });
    });
  }
}

// Iterate a single step of bubble sort
function bubbleSortStep() {
  
  // Increment the step count and display to header
  steps++;
  document.getElementById('step-number').value = steps;

  // Get current indices of sorting from webpage
  document.getElementById('index-a').value = a;
  document.getElementById('index-b').value = b;

  // Bubble sort implementation, corresponding swaps in the JavaScript array will correspond to the animation on the webpage
  if (unsortedArray[b] > unsortedArray[b + 1]) {

    var temp = unsortedArray[b + 1];
    unsortedArray[b + 1] = unsortedArray[b];
    unsortedArray[b] = temp;

    swapBlocks(unsortedBlocks[b], unsortedBlocks[b + 1], blockWidth);

    var temp = unsortedBlocks[b + 1];
    unsortedBlocks[b + 1] = unsortedBlocks[b];
    unsortedBlocks[b] = temp;

    swapTexts(unsortedText[b], unsortedText[b + 1], blockWidth);

    var temp = unsortedText[b + 1];
    unsortedText[b + 1] = unsortedText[b];
    unsortedText[b] = temp;
  } else {
    // No swapping of blocks and text
    swapBlocks(unsortedBlocks[b], unsortedBlocks[b], -1);
    swapTexts(unsortedText[b], unsortedText[b], -1);
  }

  // Keep track of indices
  if (b < parseInt(document.getElementById('size').value) - a - 1) {
    b++;
  } else {
    b = 0;
    a++;
  }
}
