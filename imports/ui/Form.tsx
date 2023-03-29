import React from "react";

import Users, { User } from "../getUsers";

interface UserRanks {
  rank: number;
  user: User;
}

interface Recipient {
  id: string;
  label: string;
  reference: React.useRef;
  onChange: Function;
  onFocus: Function;
  onBlur: Function;
  actions: React.JSX;
}

const Recipient = ({
  id,
  label,
  reference,
  onChange,
  onFocus,
  onBlur,
  actions,
}: Recipient) => {
  return (
    <div
      className="border-b"
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr max-content",
      }}
    >
      <div className="my-auto ml-auto mr-auto">
        <span>{label}</span>
        <span>
          <span className="m-1 p-1 rounded-md bg-gray-200 cursor-pointer">
            John Doe
          </span>
        </span>
      </div>
      <div>
        <input
          ref={reference}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          type="email"
          name={id}
          id={id}
          style={{ width: "100%" }}
          className="focus:ring-0 border-0 py-1.5 text-gray-900  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder=""
        />
      </div>
      <div style={{ margin: "auto 0% auto 0%" }}>{actions()}</div>
    </div>
  );
};

export const Form = () => {
  const [users, setUsers] = React.useState<User[]>();

  const [recipients, setRecipients] = React.useState<User[]>();
  const [ccRecipients, setcccRecipients] = React.useState<User[]>();
  const [bccRecipients, setBccRecipients] = React.useState<User[]>();

  const [filteredUsers, setFilteredUsers] = React.useState<UserRanks>();

  const recipientRef = React.useRef<string>("");
  const ccRef = React.useRef<string>("");
  const bccRef = React.useRef<string>("");

  const [isCcVisible, setIsCcVisible] = React.useState<boolean>(false);
  const [isBccVisible, setIsBccVisible] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Initial render
    (async () => {
      const data: User[] | undefined = await Users();
      if (data) {
        setUsers(data);
      }
    })();
  }, []);

  const isRankingEnabled = true;

  const sortByRank = (userRanks: UserRanks[]) => {
    const sortByRank = {
      key: "rank",
      orderBy: "desc",
    };
    userRanks.sort((a: UserRanks, b: UserRanks) => {
      return (
        (sortByRank.orderBy === "asc" ? 1 : -1) * // Negate result for descending
        (a[sortByRank.key] - b[sortByRank.key])
      );
    });
    return userRanks;
  };

  const handleToInput = () => {
    ``;
    // Destructure useRef
    let {
      current: { value: needle },
    } = recipientRef;
    if (needle) {
      // Filter username & email

      const passed: {
        [key: number]: UserRanks;
      } = {};
      users.map((row: User, i: number, array: User[]) => {
        // Filter username & email

        // Values to be matched
        const haystack = [row.name, row.email];

        // Convert to uppercase to match accurately
        let rowContents = haystack.join(" ").toUpperCase();

        const haystackValues = rowContents.split(" ");

        needle = needle.replace(/\s+/g, "").toUpperCase();

        haystackValues.map((value) => {
          if (value.includes(needle)) {
            if (isRankingEnabled) {
              // With ranking
              if (!passed[row.id]) {
                passed[row.id] = {
                  rank: 1,
                  user: users[i],
                };
              } else {
                passed[row.id].rank++;
              }
            } else {
              // Without ranking
              passed[row.id] = users[i];
            }
          }
        });
      });
      const ranked = sortByRank(Object.values(passed));
      const finalUsers = ranked.map(
        ({ rank, ...retainedAttributes }) => retainedAttributes.user
      );
      if (isRankingEnabled) {
        setFilteredUsers(finalUsers || []);
      } else {
        setFilteredUsers(finalUsers || []);
      }
    } else {
      setFilteredUsers(users);
    }
  };

  const handleCcInput = () => {
    alert("Cc");
  };

  const handleBccInput = () => {
    alert("Bcc");
  };

  return (
    <form onSubmit={() => {}}>
      <div className="mb-4 w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>

        <Recipient
          id={"to"}
          label={"To"}
          reference={recipientRef}
          onChange={handleToInput}
          onFocus={handleToInput}
          onBlur={() => {
            setFilteredUsers([]);
          }}
          actions={() => {
            return (
              <span>
                {!isCcVisible && (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      setIsCcVisible(!isCcVisible);
                    }}
                  >
                    Cc
                  </span>
                )}
                {!isCcVisible && !isBccVisible && " / "}
                {!isBccVisible && (
                  <span
                    className="hover:underline cursor-pointer"
                    onClick={() => {
                      setIsBccVisible(!isBccVisible);
                    }}
                  >
                    Bcc
                  </span>
                )}
              </span>
            );
          }}
        />

        {isCcVisible && (
          <Recipient
            id={"cc"}
            label={"Cc"}
            reference={ccRef}
            onChange={handleCcInput}
            onFocus={() => {}}
            onBlur={() => {}}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsCcVisible(!isCcVisible);
                    }}
                  >
                    Remove
                  </span>
                </span>
              );
            }}
          />
        )}

        {isBccVisible && (
          <Recipient
            id={"bcc"}
            label={"Bcc"}
            reference={bccRef}
            onChange={handleBccInput}
            onFocus={() => {}}
            onBlur={() => {}}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBccVisible(!isBccVisible);
                    }}
                  >
                    Remove
                  </span>
                </span>
              );
            }}
          />
        )}
      </div>

      {isRankingEnabled &&
        filteredUsers?.map((row: User, i: number, array: User[]) => {
          return (
            <p key={i}>
              {row.name} {row.email}
            </p>
          );
        })}

      <div className="mb-4">
        <label htmlFor="body" className="sr-only">
          Body
        </label>
        <textarea
          rows={4}
          name="body"
          id="body"
          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
          defaultValue={""}
          placeholder="Type your message here…"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-indigo-600 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Send
      </button>
    </form>
  );
};
