/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lentum.json`.
 */
export type Lentum = {
  "address": "Hc6k9QpHwpvG7jndx9EEE42M28DZ6EHEedogVCyjt7mL",
  "metadata": {
    "name": "lentum",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "close",
      "discriminator": [
        98,
        165,
        201,
        177,
        108,
        65,
        206,
        96
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "lentum",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "decrement",
      "discriminator": [
        106,
        227,
        168,
        59,
        248,
        27,
        150,
        101
      ],
      "accounts": [
        {
          "name": "lentum",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "increment",
      "discriminator": [
        11,
        18,
        104,
        9,
        104,
        174,
        59,
        33
      ],
      "accounts": [
        {
          "name": "lentum",
          "writable": true
        }
      ],
      "args": []
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
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "lentum",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "set",
      "discriminator": [
        198,
        51,
        53,
        241,
        116,
        29,
        126,
        194
      ],
      "accounts": [
        {
          "name": "lentum",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "value",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lentum",
      "discriminator": [
        82,
        125,
        86,
        154,
        182,
        24,
        190,
        21
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
      "msg": "Insufficient available deposits."
    }
  ],
  "types": [
    {
      "name": "lentum",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
