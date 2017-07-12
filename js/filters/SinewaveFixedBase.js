Phaser.Filter.SinewaveFixedBase = function(game) {

    Phaser.Filter.call(this, game);

    this.uniforms.iChannel0 = { type: 'sampler2D', value: null, textureData: { repeat: true } }

    this.fragmentSrc = [

        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",
        "uniform sampler2D iChannel0;",

        "void main( void ) {",

            "vec2 uv = gl_FragCoord.xy / resolution.xy;",

            "// Flip-a-roo.",
            "uv.y *= -1.0;",

            "// Represents the v/y coord(0 to 1) that will not sway.",
            "float fixedBasePosY = 0.0;",

            "// Configs for you to get the sway just right.",
            "float speed = 2.0;",
            "float verticleDensity = 6.0;",
            "float swayIntensity = 0.1;",

            "// Putting it all together.",
            "float offsetX = sin(uv.y * verticleDensity + time * speed) * swayIntensity;",

            "// Offsettin the u/x coord.",
            "uv.x += offsetX * (uv.y - fixedBasePosY);",

            "gl_FragColor = texture2D(iChannel0, uv);",

        "}"
      ];
};

Phaser.Filter.SinewaveFixedBase.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.SinewaveFixedBase.prototype.constructor = Phaser.Filter.SinewaveFixedBase;

Object.defineProperty(Phaser.Filter.SinewaveFixedBase.prototype, 'spriteTexture', {

    get: function() {
        return this.uniforms.iChannel0.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.iChannel0.value = value;
    }
});
