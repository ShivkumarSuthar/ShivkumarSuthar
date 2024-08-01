import React, { useState } from 'react';
import { CiMenuFries } from 'react-icons/ci';
import dataList from "./dataList.json"


function RightLayout() {
    const [on, setOn] = useState(false);
    const toggleSound = () => {
        setOn(!on);
    };

    return (
        <div className="right-menu">
            <div className="menu-icon">
                <CiMenuFries className='icon' />
            </div>

            <div className="sound-controls">
                <label class="switch">
                    <div class="round"><input name="onoff" id="onoff" type="checkbox"  onClick={toggleSound} />
                        <div class="back"><label for="onoff" class="but"><span class="on"></span><span class="off">ON</span></label></div>
                    </div>
                </label>
            </div>

            {on && <audio src={dataList.media.audio} autoPlay loop />}
        </div>
    );
}

export default RightLayout;
