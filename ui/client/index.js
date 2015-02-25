Sensors = new Meteor.Collection('sensor');

// counter starts at 0
// Session.setDefault('counter', 0);

// Template.hello.helpers({
//   counter: function () {
//     return Session.get('counter');
//   }
// });
//
// Template.hello.events({
//   'click button': function () {
//     // increment the counter when button is clicked
//     Session.set('counter', Session.get('counter') + 1);
//   }
// });

//console.log('starting app...');

Template.sensor_list.helpers({
  sensors: function() {
    return Sensors.find();
    Meteor.call('findSensors', {}, function(e,r){
      console.log('findSensors e:', e);
    });
  }
});


var metric = 'temp';

Template.sensor_list.rendered = function(){
    // drawFloorPlan( $('#floorplan'), "images/floorplan.svg" );
    redraw( metric );
};

// keep hash of data values by id
//static data
var data = {
  "00000000237547038fb7bdee": { temp: 15 },
  "00000000231263068fb7bdee": { temp: 20 },
  "00000000233010aeaf952dee": { temp: 30 },
  "00000000232e65058fb7bdee": { temp: 16 },
  "00000000236668afaf952dee": { temp: 24 }
};
// hash of x,y based on id
var locations = {
  "00000000237547038fb7bdee": [ 666, 425, '2BF39R' ], // 2BF39 R
  "00000000231263068fb7bdee": [ 655, 425, '2BF38R' ], // 2BF38 R
  "00000000233010aeaf952dee": [ 642, 425, '2BF37R' ], // 2BF37 R 
  "00000000232e65058fb7bdee": [ 648, 443, '2BF38F' ], // btwn 2BF37 2BF38 Front 
  "00000000236668afaf952dee": [ 638, 443, '2BF37F' ],  // btwn 2BF37 2BF38 Front
};


// attach observers for when data is added or changed
Sensors.find().observe({
  added: function(datum) {
    console.log('sensor %s added() %o', datum._id, datum);
    // lookup location if not exist; use Session?
    if( ! datum._id in locations ) {
      // TODO location[_id] = []
    }
    data[datum._id] = datum
    redraw( metric );
  },
  changed: function(datum) {
    console.log('sensor %s changed() %o', datum._id, datum);
    redraw( metric );
  }
});

// helper functions
Template.sensor_item.helpers({
  // return description of sensor
  description: function(id){
    return ( id in locations ) ? locations[id][2] : '-';
  }
});


// redraw everything
function redraw( metric ) {
  drawHeatMap( '.heatmap', metric );
  // drawCircles( $('#contrast_circle') );
}

// remap data into an array of 3-tuples (x,y,v)
function regenData( metric ) {
  var tuples = [];
  for (var id in locations) {
    if (id in data) {
      // var t = locations[id].slice(0,2);
      // t.push( parseFloat( data[id][metric] ) );
      var t = {
        x: locations[id][0],
        y: locations[id][1],
        value: parseFloat( data[id][metric] )
      };
      // console.log('REGEN: id=%s, metric=%s, data=%o tuple=%o', id, metric, data[id][metric], t);
      tuples.push(t);
    }
  }
  return tuples;
}

// draw the floorplan
function drawFloorPlan( layer, src ) {
  var plan = new Image();
  plan.src = src;
  plan.onload = function () {
    var canvas = layer;
    var ctx = canvas[0].getContext('2d');
    ctx.globalAlpha = 0.3;
    ctx.drawImage(plan, 50, 0, 1000, 1000 * plan.height / plan.width);
    ctx.globalAlpha = 1.0;
  };
};

//draw the heatmap
function drawHeatMap( layer_name, metric ) {
  var heat_data = { max: 100, min: 0, data: regenData( metric ) };
  console.log("DATA: %o", heat_data );
  var grad = {0.3: 'green', 0.4: 'orange', 1: 'red'}
  // heat = simpleheat( layer_name ).data(heat_data).max(50).gradient(grad).radius(5, 20);
  // heat.draw(1);
  console.log("drawing heatmap...");
  var heatmapInstance = h337.create({
    container: document.querySelector(layer_name),
    // onExtremaChange: function(data) {
    //   updateLegend(data);
    // }
  });
  heatmapInstance.setData( heat_data );
  console.log("DONE");
};

//draw the contrasting circles
function drawCircles( layer ){
  var canvas = layer;
  var ctx = canvas[0].getContext('2d');
  var radius = 2;
  
  for (var id in locations) {
    ctx.beginPath(); //open an svg path
    ctx.arc(locations[id][0], locations[id][1], radius, 0, 2 * Math.PI, false); //define arc
    ctx.closePath(); //close the path
    // TODO: colour by sensor state
    ctx.fillStyle = 'blue'; //define fill color
    ctx.fill(); //fill the path
    //console.log(ctx);
  }

};


//combine canvi
function combineCanvas() {
    var floor = document.getElementsByName('#floorplan');
    // var ctFloor = floor.getContext('2d');
    var thisHeat = document.getElementsByName('#heatmap');
    // var ctHeat = thisHeat.getContext('2d');
    // circles = document.getElementsByName('#contrast_circle');
    // var ctCircles = circles.getContext('2d');
    var canvas = $('#contrast_circle');
    var ctx = canvas[0].getContext('2d');
    ctx.drawImage(floor, 0, 0);
    ctx.drawImage(thisHeat, 0, 0);
}