class SmartBoi {}

SmartBoi.World = class {
    constructor() {
        this.objects = [];
        this.time = 0;
    }

    update(seconds) {
        this.time += seconds;
        let updated = true;
        let t, minT, firstTarget, object, target;

        while(updated) {
            updated = false;
            for(object of this.objects) {
                if(object.static || object.time === this.time) continue;
                if(object.collidable) {
                    minT = this.time - object.time;
                    firstTarget = null;
                    for(target of this.objects) {
                        if(!target.collidable) continue;
                        t = object.timeToCollision(target);
                        if((seconds > 0 && t > 0 && t < minT)
                        || (seconds < 0 && t < 0 && t > minT)) {
                            minT = t;
                            firstTarget = target;
                        }
                    }
                    if(firstTarget !== null) {
                        updated = true;
                        object.move(minT);
                        if(object.time === firstTarget.time) {
                            object.hit(target);
                        }
                    }
                    else {
                        object.move(seconds);
                    }
                }
                else {
                    object.move(seconds);
                }
            }
        }
    }

    add(object) {
        if(this.objects.indexOf(object) !== -1) return false;
        this.objects.push(object);
        object.time = this.time;
        return true;
    }

    remove(object) {
        this.objects.splice(this.objects.findIndex(object), 1);
    }

    has(object) {
        return(this.objects.indexOf(object));
    }
};

SmartBoi.Object = class {
  constructor(mass = 0, x = 0, y = 0) {
      this.mass = mass;
      this.x = x;
      this.y = y;

      this.static = false;
      this.collidable = true;
      this.time = 0;
      this.speed = 0;
      this.direction = 0;
  }

  move(seconds) {};
  timeToCollision(target) {};
  hit(target);
};

SmartBoi.Point = class extends SmartBoi.Object {
    constructor(mass, x, y) {
        super(mass, x, y);
    }

    distanceTo(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return Math.hypot(dx, dy);
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.hypot(dx, dy);
    }
};

SmartBoi.Circle = class extends SmartBoi.Point {
    constructor(mass, radius, x, y) {
        super(mass, x, y);
        this.radius = radius;
    }
};

SmartBoi.Line = class extends SmartBoi.Object {
    constructor(startX, startY, endX, endY) {
        super();
        this.static = true;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    get width() { return(Math.abs(this.endX - this.startX)); };
    get height() { return(Math.abs(this.endY - this.startY)); };

    get x() {
        if(this.startX < this.endX) return(this.startX + this.width / 2);
        return(this.endX + this.width / 2);
    };

    get y() {
        if(this.startY < this.endY) return(this.startY + this.height / 2);
        return(this.endY + this.height / 2);
    };

    set x(x) {
        let width = this.width;
        if(this.startX < this.endX) {
            this.startX = x - width / 2;
            this.endX = x + width / 2;
        }
        else {
            this.startX = x + width / 2;
            this.endX = x - width / 2;
        }
    }

    set y(y) {
        let height = this.height;
        if(this.startY < this.endY) {
            this.startY = y - height / 2;
            this.endY = y + height / 2;
        }
        else {
            this.startY = y + height / 2;
            this.endY = y - height / 2;
        }
    }
};