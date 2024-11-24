/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lentum.json`.
 */
export type Lentum = {
  "address": "LentumHwpvG7jndx9EEE42M28DZ6EHEedogVCyjt7mL",
  "metadata": {
    "name": "lentum",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "borrowTokens",
      "discriminator": [
        98,
        145,
        18,
        209,
        129,
        98,
        215,
        25
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  116,
                  117,
                  109,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "reserveTokenAccount",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "userBorAccount",
          "writable": true
        },
        {
          "name": "userLenbonkAccount",
          "writable": true
        },
        {
          "name": "userLenjupAccount",
          "writable": true
        },
        {
          "name": "userLenlinkAccount",
          "writable": true
        },
        {
          "name": "userLensolAccount",
          "writable": true
        },
        {
          "name": "userLenusdcAccount",
          "writable": true
        },
        {
          "name": "userLenusdtAccount",
          "writable": true
        },
        {
          "name": "userLenwifAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "borMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositTokens",
      "discriminator": [
        176,
        83,
        229,
        18,
        191,
        143,
        176,
        150
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  116,
                  117,
                  109,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "reserveTokenAccount",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "userLenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "lenMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeMarket",
      "discriminator": [
        35,
        35,
        189,
        193,
        155,
        48,
        170,
        203
      ],
      "accounts": [
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  116,
                  117,
                  109,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "repayBorrow",
      "discriminator": [
        35,
        69,
        75,
        58,
        112,
        201,
        126,
        14
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  116,
                  117,
                  109,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "reserveTokenAccount",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "userBorAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "borMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "discriminator": [
        2,
        4,
        225,
        61,
        19,
        182,
        106,
        170
      ],
      "accounts": [
        {
          "name": "userAccount",
          "writable": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  116,
                  117,
                  109,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "reserveTokenAccount",
          "writable": true
        },
        {
          "name": "userTokenAccount",
          "writable": true
        },
        {
          "name": "userLenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "lenMint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "market",
      "discriminator": [
        219,
        190,
        213,
        55,
        0,
        227,
        198,
        154
      ]
    },
    {
      "name": "userAccount",
      "discriminator": [
        211,
        33,
        136,
        16,
        186,
        110,
        242,
        127
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "overflow",
      "msg": "Overflow occurred."
    },
    {
      "code": 6001,
      "name": "underflow",
      "msg": "Underflow occurred."
    },
    {
      "code": 6002,
      "name": "maxDepositsExceeded",
      "msg": "Maximum number of deposits exceeded."
    },
    {
      "code": 6003,
      "name": "depositNotFound",
      "msg": "Deposit not found."
    },
    {
      "code": 6004,
      "name": "insufficientAvailableDeposits",
      "msg": "Not enough available deposits."
    },
    {
      "code": 6005,
      "name": "insufficientLiquidity",
      "msg": "Insufficient liquidity in the market."
    },
    {
      "code": 6006,
      "name": "insufficientCollateral",
      "msg": "Insufficient collateral provided."
    },
    {
      "code": 6007,
      "name": "maxBorrowsExceeded",
      "msg": "Maximum number of borrows exceeded."
    },
    {
      "code": 6008,
      "name": "borrowNotFound",
      "msg": "Borrow not found."
    },
    {
      "code": 6009,
      "name": "repayAmountExceedsBorrow",
      "msg": "Repay amount exceeds borrowed amount."
    },
    {
      "code": 6010,
      "name": "notUnderCollateralized",
      "msg": "User is not undercollateralized."
    },
    {
      "code": 6011,
      "name": "insufficientCollateralAfterWithdrawal",
      "msg": "Insufficient collateral after withdrawal."
    },
    {
      "code": 6012,
      "name": "unauthorized",
      "msg": "Unauthorized."
    }
  ],
  "types": [
    {
      "name": "market",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "reserve",
            "type": "pubkey"
          },
          {
            "name": "interestRateModel",
            "type": "pubkey"
          },
          {
            "name": "lastInterestUpdate",
            "type": "i64"
          },
          {
            "name": "liquidity",
            "type": "u64"
          },
          {
            "name": "totalBorrows",
            "type": "u64"
          },
          {
            "name": "feePercentage",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lenbonkMint",
            "type": "pubkey"
          },
          {
            "name": "lenjupMint",
            "type": "pubkey"
          },
          {
            "name": "lenlinkMint",
            "type": "pubkey"
          },
          {
            "name": "lensolMint",
            "type": "pubkey"
          },
          {
            "name": "lenusdcMint",
            "type": "pubkey"
          },
          {
            "name": "lenusdtMint",
            "type": "pubkey"
          },
          {
            "name": "lenwifMint",
            "type": "pubkey"
          },
          {
            "name": "borbonkMint",
            "type": "pubkey"
          },
          {
            "name": "borjupMint",
            "type": "pubkey"
          },
          {
            "name": "borlinkMint",
            "type": "pubkey"
          },
          {
            "name": "borsolMint",
            "type": "pubkey"
          },
          {
            "name": "borusdcMint",
            "type": "pubkey"
          },
          {
            "name": "borusdtMint",
            "type": "pubkey"
          },
          {
            "name": "borwifMint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "userAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "lenbonkAccount",
            "type": "pubkey"
          },
          {
            "name": "lenjupAccount",
            "type": "pubkey"
          },
          {
            "name": "lenlinkAccount",
            "type": "pubkey"
          },
          {
            "name": "lensolAccount",
            "type": "pubkey"
          },
          {
            "name": "lenusdcAccount",
            "type": "pubkey"
          },
          {
            "name": "lenusdtAccount",
            "type": "pubkey"
          },
          {
            "name": "lenwifAccount",
            "type": "pubkey"
          },
          {
            "name": "borbonkAccount",
            "type": "pubkey"
          },
          {
            "name": "borjupAccount",
            "type": "pubkey"
          },
          {
            "name": "borlinkAccount",
            "type": "pubkey"
          },
          {
            "name": "borsolAccount",
            "type": "pubkey"
          },
          {
            "name": "borusdcAccount",
            "type": "pubkey"
          },
          {
            "name": "borusdtAccount",
            "type": "pubkey"
          },
          {
            "name": "borwifAccount",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
