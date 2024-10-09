/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/promopay.json`.
 */
export type Promopay = {
  "address": "4LfbU3ApxLM8eADVNyCYZ4c9sLjnd1dS2y8H4FJVYbPE",
  "metadata": {
    "name": "promopay",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCustomer",
      "discriminator": [
        120,
        122,
        113,
        216,
        95,
        207,
        252,
        147
      ],
      "accounts": [
        {
          "name": "customer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "interests",
          "type": "string"
        }
      ]
    },
    {
      "name": "createServiceProvider",
      "discriminator": [
        177,
        133,
        131,
        73,
        226,
        57,
        149,
        83
      ],
      "accounts": [
        {
          "name": "serviceProvider",
          "writable": true,
          "signer": true
        },
        {
          "name": "codeToProvider",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "serviceType",
          "type": "string"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "providerCode",
          "type": "string"
        }
      ]
    },
    {
      "name": "createWeb3Project",
      "discriminator": [
        47,
        224,
        104,
        76,
        210,
        21,
        199,
        8
      ],
      "accounts": [
        {
          "name": "web3Project",
          "writable": true,
          "signer": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        },
        {
          "name": "promotionalVideo",
          "type": "string"
        },
        {
          "name": "projectLink",
          "type": "string"
        },
        {
          "name": "totalBudget",
          "type": "u64"
        },
        {
          "name": "rewardPerUser",
          "type": "u64"
        },
        {
          "name": "promoDuration",
          "type": "i64"
        },
        {
          "name": "makeUsersEligibleForAirdrops",
          "type": "bool"
        },
        {
          "name": "promoType",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [],
      "args": []
    },
    {
      "name": "payToProvider",
      "discriminator": [
        25,
        13,
        99,
        225,
        111,
        202,
        22,
        55
      ],
      "accounts": [
        {
          "name": "customer",
          "writable": true,
          "signer": true
        },
        {
          "name": "serviceProvider",
          "writable": true
        },
        {
          "name": "web3Project",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amountPaidByCustomer",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "codeToProvider",
      "discriminator": [
        44,
        170,
        162,
        226,
        180,
        4,
        243,
        215
      ]
    },
    {
      "name": "customer",
      "discriminator": [
        112,
        147,
        140,
        31,
        93,
        186,
        103,
        18
      ]
    },
    {
      "name": "serviceProvider",
      "discriminator": [
        14,
        72,
        40,
        52,
        66,
        51,
        252,
        108
      ]
    },
    {
      "name": "web3Project",
      "discriminator": [
        45,
        110,
        165,
        166,
        56,
        10,
        148,
        123
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "emptyName",
      "msg": "Name cannot be empty"
    },
    {
      "code": 6001,
      "name": "emptyInterests",
      "msg": "Interests cannot be empty"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "Name is too long"
    },
    {
      "code": 6003,
      "name": "interestsTooLong",
      "msg": "Interests are too long"
    },
    {
      "code": 6004,
      "name": "emptyServiceType",
      "msg": "Service type cannot be empty"
    },
    {
      "code": 6005,
      "name": "emptyLocation",
      "msg": "Location cannot be empty"
    },
    {
      "code": 6006,
      "name": "emptyProviderCode",
      "msg": "Provider code cannot be empty"
    },
    {
      "code": 6007,
      "name": "serviceTypeTooLong",
      "msg": "Service type is too long"
    },
    {
      "code": 6008,
      "name": "locationTooLong",
      "msg": "Location is too long"
    },
    {
      "code": 6009,
      "name": "providerCodeTooLong",
      "msg": "Provider code is too long"
    },
    {
      "code": 6010,
      "name": "emptyProjectName",
      "msg": "Project name cannot be empty"
    },
    {
      "code": 6011,
      "name": "emptyPromotionalVideo",
      "msg": "Promotional video cannot be empty"
    },
    {
      "code": 6012,
      "name": "emptyProjectLink",
      "msg": "Project link cannot be empty"
    },
    {
      "code": 6013,
      "name": "projectNameTooLong",
      "msg": "Project name is too long"
    },
    {
      "code": 6014,
      "name": "promotionalVideoTooLong",
      "msg": "Promotional video is too long"
    },
    {
      "code": 6015,
      "name": "projectLinkTooLong",
      "msg": "Project link is too long"
    },
    {
      "code": 6016,
      "name": "invalidTotalBudget",
      "msg": "Total budget must be greater than zero"
    },
    {
      "code": 6017,
      "name": "invalidRewardPerUser",
      "msg": "Reward per user must be greater than zero"
    },
    {
      "code": 6018,
      "name": "invalidPromoDuration",
      "msg": "Promotion duration must be greater than zero"
    },
    {
      "code": 6019,
      "name": "emptyPromoType",
      "msg": "Promotion type cannot be empty"
    },
    {
      "code": 6020,
      "name": "promoTypeTooLong",
      "msg": "Promotion type is too long"
    },
    {
      "code": 6021,
      "name": "insufficientBudget",
      "msg": "Insufficient budget for rewards"
    },
    {
      "code": 6022,
      "name": "insufficientProjectFunds",
      "msg": "Insufficient funds in the project"
    },
    {
      "code": 6023,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow occurred"
    }
  ],
  "types": [
    {
      "name": "codeToProvider",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "code",
            "type": "string"
          },
          {
            "name": "providerWallet",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "customer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "interests",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "serviceProvider",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "serviceType",
            "type": "string"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "providerCode",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "web3Project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "projectWallet",
            "type": "pubkey"
          },
          {
            "name": "projectName",
            "type": "string"
          },
          {
            "name": "promotionalVideo",
            "type": "string"
          },
          {
            "name": "projectLink",
            "type": "string"
          },
          {
            "name": "totalBudget",
            "type": "u64"
          },
          {
            "name": "rewardPerUser",
            "type": "u64"
          },
          {
            "name": "promoDuration",
            "type": "i64"
          },
          {
            "name": "makeUsersEligibleForAirdrops",
            "type": "bool"
          },
          {
            "name": "promoType",
            "type": "string"
          },
          {
            "name": "remainingBalance",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
