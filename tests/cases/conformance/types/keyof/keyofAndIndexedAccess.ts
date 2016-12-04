// @strictNullChecks: true
// @declaration: true

class Shape {
    name: string;
    width: number;
    height: number;
    visible: boolean;
}

class TaggedShape extends Shape {
    tag: string;
}

class Item {
    name: string;
    price: number;
}

class Options {
    visible: "yes" | "no";
}

type Dictionary<T> = { [x: string]: T };
type NumericallyIndexed<T> = { [x: number]: T };

const enum E { A, B, C }

type K00 = keyof any;  // string
type K01 = keyof string;  // "toString" | "charAt" | ...
type K02 = keyof number;  // "toString" | "toFixed" | "toExponential" | ...
type K03 = keyof boolean;  // "valueOf"
type K04 = keyof void;  // never
type K05 = keyof undefined;  // never
type K06 = keyof null;  // never
type K07 = keyof never;  // never

type K10 = keyof Shape;  // "name" | "width" | "height" | "visible"
type K11 = keyof Shape[];  // "length" | "toString" | ...
type K12 = keyof Dictionary<Shape>;  // string
type K13 = keyof {};  // never
type K14 = keyof Object;  // "constructor" | "toString" | ...
type K15 = keyof E;  // "toString" | "toFixed" | "toExponential" | ...
type K16 = keyof [string, number];  // "0" | "1" | "length" | "toString" | ...
type K17 = keyof (Shape | Item);  // "name"
type K18 = keyof (Shape & Item);  // "name" | "width" | "height" | "visible" | "price"
type K19 = keyof NumericallyIndexed<Shape> // never

type KeyOf<T> = keyof T;

type K20 = KeyOf<Shape>;  // "name" | "width" | "height" | "visible"
type K21 = KeyOf<Dictionary<Shape>>;  // string

type NAME = "name";
type WIDTH_OR_HEIGHT = "width" | "height";

type Q10 = Shape["name"];  // string
type Q11 = Shape["width" | "height"];  // number
type Q12 = Shape["name" | "visible"];  // string | boolean

type Q20 = Shape[NAME];  // string
type Q21 = Shape[WIDTH_OR_HEIGHT];  // number

type Q30 = [string, number][0];  // string
type Q31 = [string, number][1];  // number
type Q32 = [string, number][2];  // string | number
type Q33 = [string, number][E.A];  // string
type Q34 = [string, number][E.B];  // number
type Q35 = [string, number][E.C];  // string | number
type Q36 = [string, number]["0"];  // string
type Q37 = [string, number]["1"];  // string

type Q40 = (Shape | Options)["visible"];  // boolean | "yes" | "no"
type Q41 = (Shape & Options)["visible"];  // true & "yes" | true & "no" | false & "yes" | false & "no"

type Q50 = Dictionary<Shape>["howdy"];  // Shape
type Q51 = Dictionary<Shape>[123];  // Shape
type Q52 = Dictionary<Shape>[E.B];  // Shape

declare let cond: boolean;

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

function f10(shape: Shape) {
    let name = getProperty(shape, "name");  // string
    let widthOrHeight = getProperty(shape, cond ? "width" : "height");  // number
    let nameOrVisible = getProperty(shape, cond ? "name" : "visible");  // string | boolean
    setProperty(shape, "name", "rectangle");
    setProperty(shape, cond ? "width" : "height", 10);
    setProperty(shape, cond ? "name" : "visible", true);  // Technically not safe
}

function f11(a: Shape[]) {
    let len = getProperty(a, "length");  // number
    setProperty(a, "length", len);
}

function f12(t: [Shape, boolean]) {
    let len = getProperty(t, "length");
    let s2 = getProperty(t, "0");  // Shape
    let b2 = getProperty(t, "1");  // boolean
}

function f13(foo: any, bar: any) {
    let x = getProperty(foo, "x");  // any
    let y = getProperty(foo, "100");  // any
    let z = getProperty(foo, bar);  // any
}

class Component<PropType> {
    props: PropType;
    getProperty<K extends keyof PropType>(key: K) {
        return this.props[key];
    }
    setProperty<K extends keyof PropType>(key: K, value: PropType[K]) {
        this.props[key] = value;
    }
}

function f20(component: Component<Shape>) {
    let name = component.getProperty("name");  // string
    let widthOrHeight = component.getProperty(cond ? "width" : "height");  // number
    let nameOrVisible = component.getProperty(cond ? "name" : "visible");  // string | boolean
    component.setProperty("name", "rectangle");
    component.setProperty(cond ? "width" : "height", 10)
    component.setProperty(cond ? "name" : "visible", true);  // Technically not safe
}

function pluck<T, K extends keyof T>(array: T[], key: K) {
    return array.map(x => x[key]);
}

function f30(shapes: Shape[]) {
    let names = pluck(shapes, "name");    // string[]
    let widths = pluck(shapes, "width");  // number[]
    let nameOrVisibles = pluck(shapes, cond ? "name" : "visible");  // (string | boolean)[]
}

function f31<K extends keyof Shape>(key: K) {
    const shape: Shape = { name: "foo", width: 5, height: 10, visible: true };
    return shape[key];  // Shape[K]
}

function f32<K extends "width" | "height">(key: K) {
    const shape: Shape = { name: "foo", width: 5, height: 10, visible: true };
    return shape[key];  // Shape[K]
}

function f33<S extends Shape, K extends keyof S>(shape: S, key: K) {
    let name = getProperty(shape, "name");
    let prop = getProperty(shape, key);
    return prop;
}

function f34(ts: TaggedShape) {
    let tag1 = f33(ts, "tag");
    let tag2 = getProperty(ts, "tag");
}

class C {
    public x: string;
    protected y: string;
    private z: string;
}

// Indexed access expressions have always permitted access to private and protected members.
// For consistency we also permit such access in indexed access types.
function f40(c: C) {
    type X = C["x"];
    type Y = C["y"];
    type Z = C["z"];
    let x: X = c["x"];
    let y: Y = c["y"];
    let z: Z = c["z"];
}

function f50<T>(k: keyof T, s: string) {
    const x1 = s as keyof T;
    const x2 = k as string;
}

function f51<T, K extends keyof T>(k: K, s: string) {
    const x1 = s as keyof T;
    const x2 = k as string;
}

function f52<T>(obj: { [x: string]: boolean }, k: keyof T, s: string, n: number) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}

function f53<T, K extends keyof T>(obj: { [x: string]: boolean }, k: K, s: string, n: number) {
    const x1 = obj[s];
    const x2 = obj[n];
    const x3 = obj[k];
}

function f54<T>(obj: T, key: keyof T) {
    for (let s in obj[key]) {
    }
    const b = "foo" in obj[key];
}

function f55<T, K extends keyof T>(obj: T, key: K) {
    for (let s in obj[key]) {
    }
    const b = "foo" in obj[key];
}

function f60<T>(source: T, target: T) {
    for (let k in source) {
        target[k] = source[k];
    }
}

function f70(func: <T, U>(k1: keyof (T | U), k2: keyof (T & U)) => void) {
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'a');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'b');
    func<{ a: any, b: any }, { a: any, c: any }>('a', 'c');
}

function f71(func: <T, U>(x: T, y: U) => Partial<T & U>) {
    let x = func({ a: 1, b: "hello" }, { c: true });
    x.a;  // number | undefined
    x.b;  // string | undefined
    x.c;  // boolean | undefined
}

function f72(func: <T, U, K extends keyof T | keyof U>(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({ a: 1, b: "hello" }, { c: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { c: true }, 'b');  // string
    let c = func({ a: 1, b: "hello" }, { c: true }, 'c');  // boolean
}

function f73(func: <T, U, K extends keyof (T & U)>(x: T, y: U, k: K) => (T & U)[K]) {
    let a = func({ a: 1, b: "hello" }, { c: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { c: true }, 'b');  // string
    let c = func({ a: 1, b: "hello" }, { c: true }, 'c');  // boolean
}

function f74(func: <T, U, K extends keyof (T | U)>(x: T, y: U, k: K) => (T | U)[K]) {
    let a = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'b');  // string | boolean
}

// Repros from #12011

class Base {
    get<K extends keyof this>(prop: K) {
        return this[prop];
    }
    set<K extends keyof this>(prop: K, value: this[K]) {
        this[prop] = value;
    }
}

class Person extends Base {
    parts: number;
    constructor(parts: number) {
        super();
        this.set("parts", parts);
    }
    getParts() {
        return this.get("parts")
    }
}

class OtherPerson {
    parts: number;
    constructor(parts: number) {
        setProperty(this, "parts", parts);
    }
    getParts() {
        return getProperty(this, "parts")
    }
}

// Modified repro from #12544

function path<T, K1 extends keyof T>(obj: T, key1: K1): T[K1];
function path<T, K1 extends keyof T, K2 extends keyof T[K1]>(obj: T, key1: K1, key2: K2): T[K1][K2];
function path<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(obj: T, key1: K1, key2: K2, key3: K3): T[K1][K2][K3];
function path(obj: any, ...keys: (string | number)[]): any;
function path(obj: any, ...keys: (string | number)[]): any {
    let result = obj;
    for (let k of keys) {
        result = result[k];
    }
    return result;
}

type Thing = {
    a: { x: number, y: string },
    b: boolean
};


function f1(thing: Thing) {
    let x1 = path(thing, 'a');  // { x: number, y: string }
    let x2 = path(thing, 'a', 'y');  // string
    let x3 = path(thing, 'b');  // boolean
    let x4 = path(thing, ...['a', 'x']);  // any
}

// Repro from comment in #12114

const assignTo2 = <T, K1 extends keyof T, K2 extends keyof T[K1]>(object: T, key1: K1, key2: K2) =>
    (value: T[K1][K2]) => object[key1][key2] = value;

// Modified repro from #12573

declare function one<T>(handler: (t: T) => void): T
var empty = one(() => {}) // inferred as {}, expected

type Handlers<T> = { [K in keyof T]: (t: T[K]) => void }
declare function on<T>(handlerHash: Handlers<T>): T
var hashOfEmpty1 = on({ test: () => {} });  // {}
var hashOfEmpty2 = on({ test: (x: boolean) => {} });  // { test: boolean }

// Repro from #12624

interface Options1<Data, Computed> {
    data?: Data
    computed?: Computed;
}

declare class Component1<Data, Computed> {
    constructor(options: Options1<Data, Computed>);
    get<K extends keyof (Data & Computed)>(key: K): (Data & Computed)[K];
}

let c1 = new Component1({
    data: {
        hello: ""
    }
});

c1.get("hello");

// Repro from #12625

interface Options2<Data, Computed> {
    data?: Data
    computed?: Computed;
}

declare class Component2<Data, Computed> {
    constructor(options: Options2<Data, Computed>);
    get<K extends keyof Data | keyof Computed>(key: K): (Data & Computed)[K];
}