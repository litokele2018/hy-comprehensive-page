import React, { useEffect, useState } from "react";
import styles from "./Vip.scss";
import { Input, Select } from "antd";
import classnames from "classnames";
import Player from "xgplayer";
import { api } from "../../libs/api";

const { Search } = Input;
const { Option } = Select;

let player = null;
// "http://1251316161.vod2.myqcloud.com/29fe1275vodbj1251316161/1ae05d325285890816466811582/5SeB8iXSVRcA.mp4"
const Vip: React.FC = () => {
  let [url, setUrl] = useState<string>("");
  let [urlPrefix, setUrlPrefix] = useState<string>("");
  let [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!player) {
  //     player = new Player({
  //       id: "vs",
  //       url,
  //       playbackRate: [0.5, 0.75, 1, 1.5, 2],
  //       fluid: true,
  //       autoplay: true,
  //       pip: true,
  //     });
  //     player.crossOrigin = true;
  //   } else {
  //     player.src = url;
  //   }
  // }, [url]);

  const onSearch = (v: string): void => {
    setUrl(urlPrefix + v);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSelect = (v: string): void => {
    setUrlPrefix(v);
  };

  return (
    <div className={styles["hy-vip"]}>
      <div className={styles["hy-card"]}>
        <Search
          placeholder="input video url"
          enterButton="Search"
          size="large"
          defaultValue={url}
          onSearch={onSearch}
          loading={loading}
        />
      </div>

      <div className={classnames(styles["hy-card"], styles["hy-line-card"])}>
        <Select
          showSearch
          placeholder="Search to Select"
          onSelect={handleSelect}
        >
          {api.map((item, index) => (
            <Option value={item} key={index}>
              {item}
            </Option>
          ))}
        </Select>
      </div>

      <div className={classnames(styles["hy-card"], styles["hy-video-card"])}>
        <iframe
          id="hy-iframe"
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          width="100%"
          height="500px"
          src={url}
        ></iframe>
      </div>
      {/* <div className={classnames(styles["hy-card"], styles["hy-video-card"])}>
        <div id="vs"></div>
      </div> */}
    </div>
  );
};

export default Vip;
