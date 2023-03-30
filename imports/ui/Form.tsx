import React from "react";

import Recipient from "./Recipient";

import Users from "../getUsers";

export const Form = () => {
  const [users, setUsers] = React.useState<User[]>();

  const [isCcFieldVisible, setIsCcFieldVisible] =
    React.useState<boolean>(false);
  const [isBccFieldVisible, setIsBccFieldVisible] =
    React.useState<boolean>(false);

  const [toRecipients, setToRecipients] = React.useState<number[]>([]);
  const [ccRecipients, setCcRecipients] = React.useState<User[]>([]);
  const [bccRecipients, setBccRecipients] = React.useState<User[]>([]);

  const [filteredToUsers, setFilteredToUsers] = React.useState<User>(null);
  const [filteredCcUsers, setFilteredCcUsers] = React.useState<User>(null);
  const [filteredBccUsers, setFilteredBccUsers] = React.useState<User>(null);

  const toRef = React.useRef<string>("");
  const ccRef = React.useRef<string>("");
  const bccRef = React.useRef<string>("");

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

  const handleDropdown = (id: string, inputRef: React.useRef) => {
    // Destructure useRef
    let {
      current: { value: needle },
    } = inputRef;
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

      switch (id) {
        case "to":
          setFilteredToUsers(finalUsers || null);
          break;
        case "cc":
          console.log("cc");
          setFilteredCcUsers(finalUsers || null);
          break;
        case "bcc":
          console.log("bcc");
          setFilteredBccUsers(finalUsers || null);
          break;
        default:
          break;
      }
    } else {
      switch (id) {
        case "to":
          setFilteredToUsers(users);
          break;
        case "cc":
          setFilteredCcUsers(users);
          break;
        case "bcc":
          setFilteredBccUsers(users);
          break;
        default:
          break;
      }
    }
  };

  const handleSelectUser = (
    recipientType: RecipientTypes,
    userID: number,
    email: string,
    inputRef: React.useRef
  ) => {
    // Remove selected user from recipients
    const tempUsersHolder = structuredClone(users);
    tempUsersHolder.map((value: User, i, array) => {
      // ID
      if (value.id === userID) {
        tempUsersHolder.splice(i, 1);
      }

      // Email
      // if (value.email === email) {
      //   tempUsersHolder.splice(email, 1);
      // }
    });

    inputRef.current.value = "";

    //========EXPERIMENTAL========//
    /* Assign state setters to a variable */
    // let tempRecipientsHolder, setFilteredUsers, setRecipients;
    // switch (recipientType) {
    //   case "to":
    //     {
    //       tempRecipientsHolder = structuredClone(toRecipients);
    //       setFilteredUsers = setFilteredToUsers; // ?
    //       setRecipients = setToRecipients; // ?
    //     }
    //     break;
    //   case "cc":
    //     {
    //       tempRecipientsHolder = structuredClone(ccRecipients);
    //       setFilteredUsers = setFilteredCcUsers; // ?
    //       setRecipients = setCcRecipients; // ?
    //     }
    //     break;
    //   case "bcc":
    //     {
    //       tempRecipientsHolder = structuredClone(bccRecipients);
    //       setFilteredUsers = setFilteredBccUsers; // ?
    //       setRecipients = setBccRecipients; // ?
    //     }
    //     break;
    // }
    // tempRecipientsHolder.push(userID);
    // setFilteredUsers(tempUsersHolder); // ?
    // setRecipients(tempRecipientsHolder); // ?
    //========EXPERIMENTAL========//

    switch (recipientType) {
      case "to":
        {
          setFilteredToUsers(tempUsersHolder);
          const tempRecipientsHolder = structuredClone(toRecipients);
          // tempRecipientsHolder.push(userID);
          tempRecipientsHolder.push(email);
          setToRecipients(tempRecipientsHolder);
        }
        break;
      case "cc":
        {
          setFilteredCcUsers(tempUsersHolder);
          const tempRecipientsHolder = structuredClone(ccRecipients);
          // tempRecipientsHolder.push(userID);
          tempRecipientsHolder.push(email);
          setCcRecipients(tempRecipientsHolder);
        }
        break;
      case "bcc":
        {
          setFilteredCcUsers(tempUsersHolder);
          const tempRecipientsHolder = structuredClone(bccRecipients);
          // tempRecipientsHolder.push(userID);
          tempRecipientsHolder.push(email);
          setBccRecipients(tempRecipientsHolder);
        }
        break;
    }
  };

  const handleRemoveUser = (recipientType: RecipientTypes, userID: number) => {
    switch (recipientType) {
      case "to": {
        setToRecipients(toRecipients.filter((val: number) => val !== userID));
      }
      case "cc": {
        setCcRecipients(ccRecipients.filter((val: number) => val !== userID));
      }
      case "bcc":
        {
          setBccRecipients(
            bccRecipients.filter((val: number) => val !== userID)
          );
        }
        break;
      default:
        break;
    }
  };

  const handleAddEmail = (recipientType: RecipientTypes, email: string) => {
    switch (recipientType) {
      case "to":
        {
          const stateCopy = structuredClone(toRecipients);
          stateCopy.push(email);
          setToRecipients(stateCopy);
        }
        break;
      case "cc":
        {
          const stateCopy = structuredClone(ccRecipients);
          stateCopy.push(email);
          setCcRecipients(stateCopy);
        }
        break;
      case "bcc":
        {
          const stateCopy = structuredClone(bccRecipients);
          stateCopy.push(email);
          setBccRecipients(stateCopy);
        }
        break;
    }
  };

  return (
    users && (
      <form onSubmit={() => {}}>
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          {
            <Recipient
              recipientType={"to"}
              label={"To"}
              inputRef={toRef}
              filteredUsers={filteredToUsers}
              selectedUsers={toRecipients}
              allUsers={users}
              onChange={handleDropdown}
              onSelectUser={handleSelectUser}
              handleRemoveUser={handleRemoveUser}
              handleAddEmail={handleAddEmail}
              actions={() => {
                return (
                  <span>
                    {!isCcFieldVisible && (
                      <span
                        className="hover:underline cursor-pointer"
                        onClick={() => {
                          setIsCcFieldVisible(true);
                        }}
                      >
                        Cc
                      </span>
                    )}
                    {!isCcFieldVisible && !isBccFieldVisible && " / "}
                    {!isBccFieldVisible && (
                      <span
                        className="hover:underline cursor-pointer"
                        onClick={() => {
                          setIsBccFieldVisible(true);
                        }}
                      >
                        Bcc
                      </span>
                    )}
                  </span>
                );
              }}
            />
          }

          {isCcFieldVisible && (
            <Recipient
              recipientType={"cc"}
              label={"Cc"}
              inputRef={ccRef}
              filteredUsers={filteredCcUsers}
              selectedUsers={ccRecipients}
              allUsers={users}
              onChange={handleDropdown}
              onSelectUser={handleSelectUser}
              handleRemoveUser={handleRemoveUser}
              handleAddEmail={handleAddEmail}
              actions={() => {
                return (
                  <span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setIsCcFieldVisible(false);
                        setCcRecipients([]);
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

          {isBccFieldVisible && (
            <Recipient
              recipientType={"bcc"}
              label={"Bcc"}
              inputRef={bccRef}
              filteredUsers={filteredBccUsers}
              selectedUsers={bccRecipients}
              allUsers={users}
              onChange={handleDropdown}
              onSelectUser={handleSelectUser}
              handleRemoveUser={handleRemoveUser}
              handleAddEmail={handleAddEmail}
              actions={() => {
                return (
                  <span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setIsBccFieldVisible(!isBccFieldVisible);
                        setBccRecipients([]);
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
    )
  );
};
