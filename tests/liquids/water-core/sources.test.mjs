import test from "node:test";
import assert from "node:assert/strict";
import {createLiquidEngine} from "../../../src/liquids/core/engine.mjs";
import {WATER_DEFINITION} from "../../../src/liquids/water/physics/definition.mjs";
import {createWaterSources} from "../../../src/liquids/water/physics/sources.mjs";

function world(opts={}){return createLiquidEngine({isLoaded:()=>true,isOpen:()=>true,definitions:[WATER_DEFINITION,{id:"lava",gravityLimit:1,lateralLimit:1}],...opts});}
function finite(id,x,initialUnits){return {id,x,y:0,z:0,mode:"finite",rate:3,target:8,initialUnits};}
function renewable(id,x){return {id,x,y:0,z:0,mode:"renewable",rate:3,target:8};}

test("finite stock spends only successful insertions", ()=>{let loaded=false;const engine=world({isLoaded:()=>loaded});const s=createWaterSources({engine,sources:[finite("a",0,5)]});assert.equal(s.step().inserted,0);assert.deepEqual(s.save().remaining,[5]);loaded=true;assert.equal(s.step().finiteInserted,3);assert.equal(s.step().finiteInserted,2);assert.equal(s.step().inserted,0);assert.equal(engine.getCell(0,0,0).units,5);assert.deepEqual(s.save().remaining,[0]);});

test("renewable is opt-in and bounded", ()=>{const engine=world(),sources=[renewable("a",0),renewable("b",1)];assert.throws(()=>createWaterSources({engine,sources}),TypeError);const s=createWaterSources({engine,sources,allowRenewable:true,maxUnitsPerStep:2});assert.equal(s.step().renewableInserted,2);assert.equal(s.step().renewableInserted,2);assert.equal(engine.getCell(0,0,0).units,2);assert.equal(engine.getCell(1,0,0).units,2);assert.deepEqual(s.save().remaining,[null,null]);});

test("no refill beyond target or across foreign material", ()=>{const engine=world();engine.insert(0,0,0,"water",7);engine.insert(1,0,0,"lava",1);const s=createWaterSources({engine,sources:[finite("a",0,10),finite("b",1,10)]});assert.equal(s.step().inserted,1);assert.equal(engine.getCell(0,0,0).units,8);assert.equal(engine.getCell(1,0,0).id,"lava");assert.deepEqual(s.save().remaining,[9,10]);});

test("blocked and capacity-rejected insertions keep stock", ()=>{const engine=world({isOpen:x=>x!==0,maxCells:1});engine.insert(2,0,0,"water",8);const s=createWaterSources({engine,sources:[finite("a",0,4),finite("b",1,4)]});assert.equal(s.step().inserted,0);assert.deepEqual(s.save().remaining,[4,4]);});

test("visit budget rotates through sources including blocked ones", ()=>{const engine=world({isOpen:x=>x!==0});const s=createWaterSources({engine,sources:[finite("a",0,4),finite("b",1,4),finite("c",2,4)],maxVisits:1});assert.equal(s.step().visited,1);assert.equal(s.step().inserted,3);assert.equal(s.step().inserted,3);assert.equal(s.save().cursor,0);assert.deepEqual(s.save().remaining,[4,1,1]);});

test("snapshot restores exact next source and finite stock", ()=>{const engine=world();const sources=[finite("a",0,10),finite("b",1,10)];const opts={sources,maxVisits:1};const a=createWaterSources({engine,...opts});a.step();const engine2=world({snapshot:JSON.parse(JSON.stringify(engine.save()))});const b=createWaterSources({engine:engine2,...opts,snapshot:JSON.parse(JSON.stringify(a.save()))});for(let i=0;i<7;i++){assert.deepEqual(a.step(),b.step());assert.deepEqual(engine.save(),engine2.save());}assert.deepEqual(a.save(),b.save());});

test("invalid or changed source config fails closed", ()=>{const engine=world(),sources=[finite("a",0,5)];const s=createWaterSources({engine,sources});assert.throws(()=>createWaterSources({engine,sources:[finite("a",0,6)],snapshot:s.save()}),TypeError);assert.throws(()=>createWaterSources({engine,sources,snapshot:{...s.save(),remaining:[6]}}),TypeError);assert.throws(()=>createWaterSources({engine,sources:[...sources,finite("b",0,5)]}),TypeError);assert.throws(()=>createWaterSources({engine,sources:[{...sources[0],y:257}]}),TypeError);});

test("finite stock plus resident volume stays conserved across drainage", ()=>{const engine=world({isOpen:(x,y,z)=>x===0&&z===0&&y>=-2&&y<=0});const s=createWaterSources({engine,sources:[finite("a",0,19)]});for(let i=0;i<20;i++){s.step();engine.tick();}assert.equal(engine.save().cells.reduce((n,c)=>n+c.units,0)+s.save().remaining[0],19);assert.equal(s.save().remaining[0],0);});

test("empty source list is a bounded no-op", ()=>{const s=createWaterSources({engine:world()});assert.deepEqual(s.step(),{visited:0,finiteInserted:0,renewableInserted:0,inserted:0,changed:[]});assert.equal(s.save().cursor,0);});

test("external source adapter leaves physical sampling intact", ()=>{const engine=world();const s=createWaterSources({engine,sources:[finite("a",0,3)]});const result=s.step();assert.deepEqual(result.changed,[[0,0,0]]);assert.equal(engine.samplePoint(.5,.25,.5).fill,3/8);assert.equal(engine.samplePoint(.5,.375,.5),null);});
