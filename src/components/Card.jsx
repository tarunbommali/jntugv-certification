/* eslint-disable no-unused-vars */
import { global_classnames } from "../utils/classnames.js";

const Card = ({ title, subtitle, Icon }) => (
  <div
    style={{
      backgroundColor: global_classnames.card.card_bg,
      borderColor: global_classnames.card.card_border,
    }}
    className="flex p-2 rounded-lg border shadow-sm  items-center "
  >
    <Icon className="h-10 w-10 text-white " />
    <div className="flex flex-col px-2  text-left">
    <h3
      style={{ color: global_classnames.card.card_heading }}
      className="font-semibold text-lg"
    >
      {title}
    </h3>
    <p
      style={{ color: global_classnames.card.card_description }}
      className="text-sm"
    >
      {subtitle}
    </p>


    </div>
  </div>
);

export default Card;
