import React, { useState, useContext, useEffect } from "react";
import { useQuery, useMutation } from "react-query";

import MailBody from "./components/MailBody";
import ReplyIcon from "./components/ReplyIcon";
import TrashIcon from "./components/TrashIcon";

import { Context } from "../../..";

import "./index.scss";

const MailsNotRendered = () => {
  return <div className="mails_container">Please Select Account</div>;
};

const MailsRendered = ({ selectedAccount }) => {
  const [activeMailId, setActiveMailId] = useState({});
  const getMails = () => {
    return fetch(`/api/mails/${selectedAccount}`).then((r) => r.json());
  };
  const queryData = useQuery("getMails_" + selectedAccount, getMails);

  const deleteMail = (mailId) =>
    fetch(`/api/mails/${mailId}`, { method: "DELETE" }).then((r) => r.json());
  const mutation = useMutation(deleteMail);

  useEffect(() => {
    if (mutation.status === "success" && queryData.refetch) queryData.refetch();
  }, [mutation.status, queryData.refetch]);

  if (queryData.isLoading) {
    return <div className="mails_container">Loading Mails List...</div>;
  }

  if (queryData.error) {
    return <div className="mails_container">Mails List Request Failed</div>;
  }

  if (queryData.isSuccess) {
    const mails = queryData.data || [];

    const MailsList = () => {
      const result = mails.map((mail, i) => {
        const date = new Date(mail.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        const time = new Date(mail.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        });

        let duration =
          (Number(Date.now()) - Number(new Date(mail.date))) / (1000 * 60);
        if (duration > 2 * 24 * 60) {
          duration = `${Math.floor(duration / (60 * 24))} days ago`;
        } else if (duration > 2 * 60) {
          duration = `${Math.floor(duration / 60)} hours ago`;
        } else if (duration > 2) {
          duration = `${Math.floor(duration)} minutes ago`;
        } else {
          duration = "just now";
        }

        const onClickMailcard = () => {
          if (activeMailId[mail.id]) {
            const clonedActiveMailId = { ...activeMailId };
            delete clonedActiveMailId[mail.id];
            setActiveMailId(clonedActiveMailId);
          } else {
            const clonedActiveMailId = { ...activeMailId, [mail.id]: true };
            setActiveMailId(clonedActiveMailId);
          }
        };

        const onClickTrash = () => {
          const sure = window.confirm("Do you want to delete this mail?");
          if (sure) {
            mutation.mutate(mail.id);
          }
        };

        return (
          <blockquote key={i} className="mailcard">
            <div className="header cursor" onClick={onClickMailcard}>
              <div className="mailcard-small content">{duration}</div>
              <div className="mailcard-small content">
                {date}, {time}
              </div>
              <div className="mailcard-small content">{mail.from?.text}</div>
              <div className="mailcard-subject content">{mail.subject}</div>
            </div>
            {activeMailId[mail.id] ? <MailBody mailId={mail.id} /> : null}
            <div className="actionBox">
              <div className="iconBox">
                <ReplyIcon className="cursor" />
              </div>
              <div className="iconBox">
                <TrashIcon className="cursor" onClick={onClickTrash} />
              </div>
            </div>
          </blockquote>
        );
      });

      return result;
    };

    return (
      <div className="mails_container">
        <MailsList />
      </div>
    );
  }
};

const Mails = ({ selectedAccount }) => {
  const { isWriterOpen, setIsWriterOpen } = useContext(Context);
  const onClickCurtain = () => {
    setIsWriterOpen(false);
  };
  return (
    <>
      <div
        className={isWriterOpen ? "curtain on" : "curtain"}
        onClick={onClickCurtain}
      />
      {selectedAccount ? (
        <MailsRendered selectedAccount={selectedAccount} />
      ) : (
        <MailsNotRendered />
      )}
    </>
  );
};

export default Mails;