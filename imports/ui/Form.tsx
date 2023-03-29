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
  onSelectUser: Function;
  actions: React.JSX;
  selectedUsers: User[];
  filteredUsers: User[] | null;
}

enum RecipientTypes {
  to = "to",
  cc = "cc",
  bcc = "bcc",
}

const Recipient = ({
  id,
  selectedUsers,
  label,
  reference,
  onChange,
  onFocus,
  onBlur,
  onSelectUser,
  actions,
  filteredUsers,
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
          {selectedUsers &&
            selectedUsers.length !== 0 &&
            selectedUsers.map((row, i, array) => {
              return (
                <span
                  className="m-1 p-1 rounded-md bg-gray-200 cursor-pointer"
                  onClick={() => {
                    alert(row.id);
                  }}
                >
                  {JSON.stringify(row)}
                </span>
              );
            })}
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
        {filteredUsers && filteredUsers.length !== 0 && (
          <div
            className="cursor-pointer bg-slate-800 text-white rounded-md p-3 h-min max-h-80 overflow-y-scroll w-80"
            style={{ position: "absolute", top: "80px" }}
          >
            {filteredUsers.map((row: User, i: number, array: User[]) => {
              return (
                <div
                  key={i}
                  className="p-1"
                  onMouseDown={() => {
                    onSelectUser(id, row.id);
                  }}
                >
                  <p className="font-semibold">{row.name}</p>
                  <p>{row.email}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ margin: "auto 0% auto 0%" }}>{actions()}</div>
    </div>
  );
};

export const Form = () => {
  const [users, setUsers] = React.useState<User[]>();

  const [recipients, setRecipients] = React.useState<User[]>([]);
  const [ccRecipients, setcccRecipients] = React.useState<User[]>([]);
  const [bccRecipients, setBccRecipients] = React.useState<User[]>([]);

  const [filteredUsers, setFilteredUsers] = React.useState<User>(null);

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
        setFilteredUsers(finalUsers || null);
      } else {
        setFilteredUsers(finalUsers || null);
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

  const handleSelectUser = (recipientType: RecipientTypes, userID: number) => {
    switch (recipientType) {
      case "to":
        const tempUsersHolder = structuredClone(recipients);
        tempUsersHolder.push({ id: userID });
        setRecipients(tempUsersHolder);
        break;
      case "cc":
        break;
      case "bcc":
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={() => {}}>
      <div className="mb-4 w-full">
        <label htmlFor="email" className="sr-only">
          Email
        </label>

        <Recipient
          id={"to"}
          selectedUsers={recipients}
          label={"To"}
          reference={recipientRef}
          onChange={handleToInput}
          onFocus={handleToInput}
          onBlur={() => {
            setFilteredUsers(null);
          }}
          onSelectUser={handleSelectUser}
          filteredUsers={filteredUsers}
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
            selectedUsers={ccRecipients}
            label={"Cc"}
            reference={ccRef}
            onChange={handleCcInput}
            onFocus={() => {}}
            onBlur={() => {}}
            onSelectUser={handleSelectUser}
            filteredUsers={filteredUsers}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsCcVisible(!isCcVisible);
                    }}
                  >
                    {/* prettier-ignore */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                  </span>
                </span>
              );
            }}
          />
        )}

        {isBccVisible && (
          <Recipient
            id={"bcc"}
            selectedUsers={bccRecipients}
            label={"Bcc"}
            reference={bccRef}
            onChange={handleBccInput}
            onFocus={() => {}}
            onBlur={() => {}}
            onSelectUser={handleSelectUser}
            filteredUsers={filteredUsers}
            actions={() => {
              return (
                <span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setIsBccVisible(!isBccVisible);
                    }}
                  >
                    {/* prettier-ignore */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
                  </span>
                </span>
              );
            }}
          />
        )}
      </div>

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
