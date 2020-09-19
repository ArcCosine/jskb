import adjustSizer from "../ts/utils/adjustsizer";

const ajs = new adjustSizer();

it("Size Test", ()=>{
    expect(ajs.getWidth()).toEqual(650);
    expect(ajs.getHeight()).toEqual(650);
});
