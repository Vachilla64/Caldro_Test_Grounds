import {_hasImplementInterface} from "../core/util.js";
import {Interface} from "../core/constants.js";


export class Collision {


    static circTocirc(c1, c2) {
        if(!(_hasImplementInterface(c1, Interface.circle)) || 
            !(_hasImplementInterface(c2, Interface.circle)))
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = c2.pos.x - c1.pos.x;
        let diffY = c2.pos.y - c1.pos.y;
        let diffZ = c2.pos.z - c1.pos.z || 0;
        return Math.hypot(diffX, diffY, diffZ) < (c1.radius + c2.radius);
    }

    static rectTorect(r1, r2) {
        if(!(_hasImplementInterface(r1, Interface.rect)) || 
            !(_hasImplementInterface(r2, Interface.rect)))
            throw TypeError("Rectangle Object Must define the properties [pos, size]");
        return r1.pos.x < r2.pos.x + r2.size.x  && r1.pos.x + r1.size.x > r2.pos.x && 
        r1.pos.y < r2.pos.y + r2.size.y  && r1.pos.y + r1.size.y > r2.pos.y
    }

    static circToRect(circle, rect) {
        if(!(_hasImplementInterface(rect, Interface.rect)))
            throw TypeError("Rectangle Object Must define the properties [pos, size");
        if(!(_hasImplementInterface(circle, Interface.circle)))
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = Math.abs(circle.pos.x - ( rect.pos.x + rect.size.x/2 ) );
        let diffY = Math.abs( circle.pos.y - ( rect.pos.y + rect.size.y/2 ) );
        if( diffX > circle.radius + rect.size.x / 2 ) return false;
        if( diffY > circle.radius + rect.size.y / 2 ) return false; 
        if( diffX <= rect.size.x ) return true;
        if( diffY <= rect.size.y ) return true;
        diffX = diffX - rect.size.x;
        diffY = diffY - rect.size.y;
        return diffX * diffX + diffY * diffY <= circle.radius * circle.radius;
    }

    static isPointInWedge(point, wedge) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(wedge, Interface.wedge))) 
            throw TypeError("Wedge Object Must define the properties [pos, radius, startAngle, endAngle]");
        const PI2 = Math.PI * 2;
        let diffX = point.x - wedge.pos.x;
        let diffY = point.y - wedge.pos.y;
        let r2 = wedge.radius * wedge.radius;
        if( diffX * diffX + diffY * diffY > r2 ) return(false);
        let angle = ( Math.atan2( diffY, diffX) + PI2) % PI2;
        return angle >= wedge.startAngle && angle <= wedge.endAngle;
    }

    static isPointInCirc(point, circle) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(circle, Interface.circle))) 
            throw TypeError("Circle Object Must define the properties [pos, radius]");
        let diffX = point.x - circle.pos.x;
        let diffY = point.y - circle.pos.y;
        return diffX * diffX + diffY * diffY < circle.radius * circle.radius;
    }

    static isPointInRect(point, rect) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(rect, Interface.rect))) 
            throw TypeError("Rectangle Object Must define the properties [pos, size]");
        return point.x > rect.pos.x && point.x < rect.pos.x + rect.size.x && 
        point.y > rect.size.y && point.y < rect.pos.y + rect.size.y;
    }

    static isPointInArc(point, arc) {
        if(!(_hasImplementInterface(point, Interface.point))) 
            throw TypeError("Point Object Must define the properties [x, y]");
        if(!(_hasImplementInterface(arc, Interface.wedge))) 
            throw TypeError("Arc Object Must define the properties [pos, radius, innerRadius, outerRadius, startAngle, endAngle]");
        let diffX = point.x - arc.pos.x;
        let diffY = point.y - arc.pos.y;
        let dxy = diffX * diffX + diffY * diffY;
        let rrOuter = arc.outerRadius * arc.outerRadius;
        let rrInner = arc.innerRadius * arc.innerRadius;
        if ( dxy < rrInner || dxy > rrOuter) return(false);
        let angle = (Math.atan2(diffY, diffX) + PI2) % PI2;
        return angle >= arc.startAngle && angle <= arc.endAngle;
    }

    static lineSegmentIntercept(l1, l2) {

    }

    static lineSegmentInterceptPoint(l1, l2) {

    }

    static lineSegmentToCirc(l, c) {

    }

    static lineSegmentToRect(l, r) {

    }


    static convexPolygon(p1, p2) {

    }


    static polygon(p1, p2) {

    }

};