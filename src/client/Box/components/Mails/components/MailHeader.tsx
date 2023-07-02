import React, { useContext } from "react";

import { Context } from "client";
import { getDateForMailHeader } from "client";
import { EmailAdressValue, MailHeaderType } from "server";

export interface MailHeaderProps extends React.ComponentProps<"div"> {
  mail: MailHeaderType;
  isActive: boolean;
}

const MailHeader = (props: MailHeaderProps) => {
  const { mail, isActive, onClick, onMouseLeave } = props;
  const { isWriterOpen } = useContext(Context);
  const { date, time, duration } = getDateForMailHeader(new Date(mail.date));

  const saved = mail.label === "saved";

  const classes = ["mailcard"];

  if (!mail.read) classes.push("unread");
  if (!isWriterOpen) classes.push("shadow");
  if (saved) classes.push("star");

  if (!Array.isArray(mail.from.value)) mail.from.value = [mail.from.value];
  if (!Array.isArray(mail.to.value)) mail.to.value = [mail.to.value];

  const { cc, bcc } = mail;
  if (cc?.value && !Array.isArray(cc.value)) cc.value = [cc.value];
  if (bcc?.value && !Array.isArray(bcc.value)) bcc.value = [bcc.value];

  return (
    <div
      className="header cursor"
      onClick={onClick}
      onMouseLeave={onMouseLeave}
    >
      <div className="mailcard-small content">{duration}</div>
      <div className={"mailcard-small content" + (isActive ? "" : " closed")}>
        {date}, {time}
      </div>
      <div className="mailcard-small content">
        {"from: " +
          mail.from.value?.map((e) => e?.name || e?.address).join(", ")}
      </div>
      <div className={"mailcard-small content" + (isActive ? "" : " closed")}>
        {"to: " + mail.to.value?.map((e) => e?.name || e?.address).join(", ")}
      </div>
      {cc && cc.value ? (
        <div className={"mailcard-small content" + (isActive ? "" : " closed")}>
          {"cc: " +
            (cc.value as EmailAdressValue[])
              .map((e) => e?.name || e?.address)
              .join(", ")}
        </div>
      ) : (
        <></>
      )}
      {bcc && bcc.value ? (
        <div className={"mailcard-small content" + (isActive ? "" : " closed")}>
          {"bcc: " +
            (bcc.value as EmailAdressValue[])
              .map((e) => e?.name || e?.address)
              .join(", ")}
        </div>
      ) : (
        <></>
      )}
      <div className="mailcard-subject content">{mail.subject}</div>
    </div>
  );
};

export default MailHeader;