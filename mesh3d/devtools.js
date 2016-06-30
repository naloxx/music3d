// dev controls
window.addEventListener("keydown", function(event) {
    switch (event.which) {
        case 86: // S
            inputState.vrEnabled = !inputState.vrEnabled;
            renderer.setSize(WIDTH, HEIGHT);
            effect.setSize(WIDTH, HEIGHT);
            break;
        case 82: // R
            inputState.rotating = !inputState.rotating;

    }

}, true);


