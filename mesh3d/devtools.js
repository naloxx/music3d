// dev controls
window.addEventListener("keydown", function(event) {
    switch (event.which) {
        case 86: // S
            animationState.vrEnabled = !animationState.vrEnabled;
            renderer.setSize(WIDTH, HEIGHT);
            effect.setSize(WIDTH, HEIGHT);
            break;
        case 82: // R
            animationState.rotating = !animationState.rotating;

    }

}, true);


